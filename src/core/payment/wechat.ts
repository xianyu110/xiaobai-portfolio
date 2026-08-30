import * as crypto from 'crypto';

import {
  CheckoutSession,
  PaymentConfigs,
  PaymentEvent,
  PaymentEventType,
  PaymentOrder,
  PaymentProvider,
  PaymentSession,
  PaymentStatus,
} from './types';

/**
 * WeChat Pay (Native) provider configs
 * @docs https://pay.weixin.qq.com/doc/v3/merchant/4012791858
 */
export interface WechatPayConfigs extends PaymentConfigs {
  appId: string; // 公众号/小程序 AppID
  mchId: string; // 商户号
  apiV3Key: string; // APIv3 密钥 (32 bytes)
  privateKey: string; // 商户API私钥 (PEM)
  serialNo: string; // 商户API证书序列号
  notifyUrl?: string; // 支付结果通知 URL
  platformCert?: string; // 平台证书 PEM (用于 webhook 签名验证) — required for notify
}

/**
 * WeChat Pay (Native) provider — V3 API
 * Uses Native Pay (扫码支付) to generate a QR code URL.
 *
 * @docs https://pay.weixin.qq.com/doc/v3/merchant/4012791858
 */
export class WechatPayProvider implements PaymentProvider {
  readonly name = 'wechat';
  configs: WechatPayConfigs;

  private baseUrl = 'https://api.mch.weixin.qq.com';

  constructor(configs: WechatPayConfigs) {
    this.configs = configs;
  }

  /**
   * Create payment — Native Pay (returns a code_url for QR code)
   */
  async createPayment({
    order,
  }: {
    order: PaymentOrder;
  }): Promise<CheckoutSession> {
    if (!order.price) {
      throw new Error('Price is required for WeChat payment');
    }

    const outTradeNo = order.orderNo || `WX${Date.now()}`;

    const payload = {
      appid: this.configs.appId,
      mchid: this.configs.mchId,
      description: order.description || 'Her Subscription',
      out_trade_no: outTradeNo,
      notify_url: this.configs.notifyUrl || '',
      amount: {
        total: order.price.amount, // 单位：分
        currency: 'CNY',
      },
      attach: order.metadata ? JSON.stringify(order.metadata) : undefined,
    };

    const result = await this.request(
      'POST',
      '/v3/pay/transactions/native',
      payload
    );

    if (!result.code_url) {
      throw new Error(result.message || 'WeChat Pay create order failed');
    }

    // Native Pay returns a code_url (weixin://wxpay/bizpayurl?pr=xxx)
    // Frontend needs to render this as a QR code for user to scan
    // We wrap it in a page that shows the QR code
    const qrPageUrl = `/payment/wechat-qr?code_url=${encodeURIComponent(result.code_url)}&order_no=${outTradeNo}&amount=${order.price.amount}`;

    return {
      provider: this.name,
      checkoutParams: payload,
      checkoutInfo: {
        sessionId: outTradeNo,
        checkoutUrl: qrPageUrl,
      },
      checkoutResult: result,
      metadata: order.metadata || {},
    };
  }

  /**
   * Query payment status
   */
  async getPaymentSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<PaymentSession> {
    const result = await this.request(
      'GET',
      `/v3/pay/transactions/out-trade-no/${sessionId}?mchid=${this.configs.mchId}`
    );

    if (!result.trade_state) {
      throw new Error(result.message || 'Query payment failed');
    }

    return {
      provider: this.name,
      paymentStatus: this.mapTradeState(result.trade_state),
      paymentInfo: {
        transactionId: result.transaction_id,
        amount: result.amount?.total,
        currency: 'cny',
        paymentAmount: result.amount?.payer_total || result.amount?.total,
        paymentCurrency: 'cny',
        paymentUserId: result.payer?.openid,
        paidAt: result.success_time ? new Date(result.success_time) : undefined,
      },
      paymentResult: result,
      metadata: result.attach ? JSON.parse(result.attach) : undefined,
    };
  }

  /**
   * Handle WeChat Pay V3 webhook notification
   */
  async getPaymentEvent({ req }: { req: Request }): Promise<PaymentEvent> {
    const body = await req.text();
    const timestamp = req.headers.get('Wechatpay-Timestamp') || '';
    const nonce = req.headers.get('Wechatpay-Nonce') || '';
    const signature = req.headers.get('Wechatpay-Signature') || '';

    if (!timestamp || !nonce || !signature) {
      throw new Error('Missing WeChat Pay webhook headers');
    }

    // Fail-closed: refuse to process notifications without the platform cert.
    if (!this.configs.platformCert) {
      throw new Error(
        'WeChat platform certificate not configured — refusing webhook'
      );
    }

    // Reject stale or future-dated notifications (±5 min window).
    const tsNum = parseInt(timestamp, 10);
    const nowSec = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(tsNum) || Math.abs(nowSec - tsNum) > 300) {
      throw new Error('WeChat webhook timestamp outside acceptable window');
    }

    // Verify signature: signed payload is `timestamp\nnonce\nbody\n`
    // signed with merchant platform certificate (RSA-SHA256).
    const signedPayload = `${timestamp}\n${nonce}\n${body}\n`;
    let sigOk = false;
    try {
      sigOk = crypto
        .createVerify('RSA-SHA256')
        .update(signedPayload)
        .verify(
          this.normalizePlatformCert(this.configs.platformCert),
          signature,
          'base64'
        );
    } catch (e) {
      sigOk = false;
    }
    if (!sigOk) {
      throw new Error('Invalid WeChat webhook signature');
    }

    const notification = JSON.parse(body);
    const resource = notification.resource;

    if (!resource) {
      throw new Error('Invalid webhook payload');
    }

    // Decrypt the notification resource using AES-256-GCM
    const decrypted = this.decryptResource(resource);
    const trade = JSON.parse(decrypted);

    const eventType =
      notification.event_type === 'TRANSACTION.SUCCESS'
        ? PaymentEventType.PAYMENT_SUCCESS
        : PaymentEventType.PAYMENT_FAILED;

    const paymentSession: PaymentSession = {
      provider: this.name,
      paymentStatus: this.mapTradeState(trade.trade_state),
      paymentInfo: {
        transactionId: trade.transaction_id,
        amount: trade.amount?.total,
        currency: 'cny',
        paymentAmount: trade.amount?.payer_total || trade.amount?.total,
        paymentCurrency: 'cny',
        paymentUserId: trade.payer?.openid,
        paidAt: trade.success_time ? new Date(trade.success_time) : undefined,
      },
      paymentResult: trade,
      metadata: trade.attach ? JSON.parse(trade.attach) : undefined,
    };

    return {
      eventType,
      eventResult: notification,
      paymentSession,
    };
  }

  // ─── V3 API request helper ─────────────────────────────────────────────────

  private async request(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const bodyStr = body ? JSON.stringify(body) : '';

    // Build signature string
    const signStr = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyStr}\n`;
    const sign = crypto
      .createSign('RSA-SHA256')
      .update(signStr)
      .sign(this.normalizePrivateKey(this.configs.privateKey), 'base64');

    const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.configs.mchId}",nonce_str="${nonce}",signature="${sign}",timestamp="${timestamp}",serial_no="${this.configs.serialNo}"`;

    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authorization,
      },
      body: body ? bodyStr : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `WeChat Pay API error: ${res.status}`);
    }

    // 204 No Content (e.g. close order)
    if (res.status === 204) return {};

    return await res.json();
  }

  /**
   * Decrypt V3 notification resource using AES-256-GCM
   */
  private decryptResource(resource: {
    algorithm: string;
    ciphertext: string;
    associated_data?: string;
    nonce: string;
  }): string {
    const key = Buffer.from(this.configs.apiV3Key, 'utf-8');
    const iv = Buffer.from(resource.nonce, 'utf-8');
    const ciphertext = Buffer.from(resource.ciphertext, 'base64');
    const aad = resource.associated_data
      ? Buffer.from(resource.associated_data, 'utf-8')
      : Buffer.alloc(0);

    // The last 16 bytes are the auth tag
    const authTag = ciphertext.subarray(ciphertext.length - 16);
    const data = ciphertext.subarray(0, ciphertext.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    if (aad.length > 0) {
      decipher.setAAD(aad);
    }

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf-8');
  }

  private mapTradeState(state: string): PaymentStatus {
    switch (state) {
      case 'SUCCESS':
        return PaymentStatus.SUCCESS;
      case 'CLOSED':
      case 'REVOKED':
        return PaymentStatus.CANCELED;
      case 'PAYERROR':
        return PaymentStatus.FAILED;
      case 'NOTPAY':
      case 'USERPAYING':
        return PaymentStatus.PROCESSING;
      default:
        return PaymentStatus.PROCESSING;
    }
  }

  private normalizePrivateKey(key: string): string {
    if (key.includes('-----BEGIN')) return key;
    return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
  }

  private normalizePlatformCert(cert: string): string {
    if (cert.includes('-----BEGIN')) return cert;
    return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;
  }
}

/**
 * Create WeChat Pay provider with configs
 */
export function createWechatPayProvider(
  configs: WechatPayConfigs
): WechatPayProvider {
  return new WechatPayProvider(configs);
}
