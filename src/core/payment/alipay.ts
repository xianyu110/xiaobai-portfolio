import * as crypto from 'crypto';

import {
  CheckoutSession,
  PaymentConfigs,
  PaymentEvent,
  PaymentEventType,
  PaymentInterval,
  PaymentOrder,
  PaymentProvider,
  PaymentSession,
  PaymentStatus,
  SubscriptionCycleType,
  SubscriptionInfo,
  SubscriptionStatus,
  WebhookIgnoredError,
} from './types';

/**
 * Alipay payment provider configs
 * @docs https://opendocs.alipay.com/open/
 */
export interface AlipayConfigs extends PaymentConfigs {
  appId: string;
  privateKey: string; // RSA2 private key (PKCS1 or PKCS8)
  alipayPublicKey: string; // Alipay public key for signature verification
  signType?: 'RSA2' | 'RSA';
  returnUrl?: string; // redirect after payment
  notifyUrl?: string; // webhook notify URL
}

/**
 * Alipay payment provider implementation
 * @docs https://opendocs.alipay.com/open/028r8t
 */
export class AlipayProvider implements PaymentProvider {
  readonly name = 'alipay';
  configs: AlipayConfigs;

  private gateway: string;

  constructor(configs: AlipayConfigs) {
    this.configs = configs;
    this.gateway = 'https://openapi.alipay.com/gateway.do';
  }

  /**
   * Create payment — generates Alipay PC payment page URL
   * Uses alipay.trade.page.pay for desktop or alipay.trade.wap.pay for mobile
   */
  async createPayment({
    order,
  }: {
    order: PaymentOrder;
  }): Promise<CheckoutSession> {
    if (!order.price) {
      throw new Error('Price is required for Alipay payment');
    }

    const outTradeNo = order.orderNo || `ALI${Date.now()}`;
    const totalAmount = (order.price.amount / 100).toFixed(2); // Convert cents to yuan

    const bizContent = {
      out_trade_no: outTradeNo,
      total_amount: totalAmount,
      subject: order.description || 'Her Subscription',
      product_code: 'FAST_INSTANT_TRADE_PAY',
      // Pass metadata as passback_params for webhook identification
      passback_params: order.metadata
        ? encodeURIComponent(JSON.stringify(order.metadata))
        : undefined,
    };

    const params = this.buildRequestParams('alipay.trade.page.pay', bizContent);

    // Add return_url — append order_no so callback can query status
    const baseReturnUrl = order.successUrl || this.configs.returnUrl || '';
    if (baseReturnUrl) {
      const sep = baseReturnUrl.includes('?') ? '&' : '?';
      params.return_url = `${baseReturnUrl}${sep}order_no=${outTradeNo}`;
    }
    if (this.configs.notifyUrl) {
      params.notify_url = this.configs.notifyUrl;
    }

    // Sign the params
    const signedParams = this.signParams(params);

    // Build the full redirect URL
    const checkoutUrl = `${this.gateway}?${new URLSearchParams(signedParams).toString()}`;

    return {
      provider: this.name,
      checkoutParams: signedParams,
      checkoutInfo: {
        sessionId: outTradeNo,
        checkoutUrl,
      },
      checkoutResult: { outTradeNo, totalAmount },
      metadata: order.metadata || {},
    };
  }

  /**
   * Get payment session by querying Alipay trade status
   */
  async getPaymentSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<PaymentSession> {
    const bizContent = {
      out_trade_no: sessionId,
    };

    const result = await this.execute('alipay.trade.query', bizContent);
    const response = result.alipay_trade_query_response;

    if (!response || response.code !== '10000') {
      throw new Error(
        response?.sub_msg || response?.msg || 'Query payment failed'
      );
    }

    return {
      provider: this.name,
      paymentStatus: this.mapAlipayStatus(response.trade_status),
      paymentInfo: {
        transactionId: response.trade_no,
        amount: Math.round(parseFloat(response.total_amount) * 100),
        currency: 'cny',
        paymentAmount: Math.round(
          parseFloat(response.buyer_pay_amount || response.total_amount) * 100
        ),
        paymentCurrency: 'cny',
        paymentUserId: response.buyer_user_id,
        paymentEmail: response.buyer_logon_id,
        paidAt: response.send_pay_date
          ? new Date(response.send_pay_date)
          : undefined,
      },
      paymentResult: response,
      metadata: response.passback_params
        ? JSON.parse(decodeURIComponent(response.passback_params))
        : undefined,
    };
  }

  /**
   * Handle Alipay async notification (webhook)
   */
  async getPaymentEvent({ req }: { req: Request }): Promise<PaymentEvent> {
    const body = await req.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    // Verify signature
    if (!this.verifySignature(params)) {
      throw new Error('Invalid Alipay notification signature');
    }

    const tradeStatus = params.trade_status;
    let eventType: PaymentEventType;

    switch (tradeStatus) {
      case 'TRADE_SUCCESS':
      case 'TRADE_FINISHED':
        eventType = PaymentEventType.PAYMENT_SUCCESS;
        break;
      case 'TRADE_CLOSED':
        eventType = PaymentEventType.PAYMENT_FAILED;
        break;
      default:
        throw new WebhookIgnoredError(
          `Unhandled Alipay trade status: ${tradeStatus}`
        );
    }

    const metadata = params.passback_params
      ? JSON.parse(decodeURIComponent(params.passback_params))
      : undefined;

    const paymentSession: PaymentSession = {
      provider: this.name,
      paymentStatus:
        eventType === PaymentEventType.PAYMENT_SUCCESS
          ? PaymentStatus.SUCCESS
          : PaymentStatus.FAILED,
      paymentInfo: {
        transactionId: params.trade_no,
        amount: Math.round(parseFloat(params.total_amount) * 100),
        currency: 'cny',
        paymentAmount: Math.round(
          parseFloat(params.buyer_pay_amount || params.total_amount) * 100
        ),
        paymentCurrency: 'cny',
        paymentUserId: params.buyer_id,
        paymentEmail: params.buyer_logon_id,
        paidAt: params.gmt_payment ? new Date(params.gmt_payment) : undefined,
      },
      paymentResult: params,
      metadata,
    };

    return {
      eventType,
      eventResult: params,
      paymentSession,
    };
  }

  // ─── Internal helpers ────────────────────────────────────────────────────────

  /**
   * Execute an Alipay API call
   */
  private async execute(method: string, bizContent: any): Promise<any> {
    const params = this.buildRequestParams(method, bizContent);
    if (this.configs.notifyUrl) {
      params.notify_url = this.configs.notifyUrl;
    }

    const signedParams = this.signParams(params);

    const response = await fetch(this.gateway, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(signedParams).toString(),
    });

    return await response.json();
  }

  /**
   * Build common request parameters
   */
  private buildRequestParams(
    method: string,
    bizContent: any
  ): Record<string, string> {
    return {
      app_id: this.configs.appId,
      method,
      format: 'JSON',
      charset: 'utf-8',
      sign_type: this.configs.signType || 'RSA2',
      timestamp: this.formatTimestamp(new Date()),
      version: '1.0',
      biz_content: JSON.stringify(bizContent),
    };
  }

  /**
   * Sign parameters with RSA2
   */
  private signParams(params: Record<string, string>): Record<string, string> {
    // Sort params alphabetically and build sign string
    const sortedKeys = Object.keys(params).sort();
    const signStr = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== '')
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    const algorithm =
      (this.configs.signType || 'RSA2') === 'RSA2'
        ? 'SHA256withRSA'
        : 'SHA1withRSA';

    const sign = crypto
      .createSign(algorithm === 'SHA256withRSA' ? 'RSA-SHA256' : 'RSA-SHA1')
      .update(signStr, 'utf-8')
      .sign(this.normalizePrivateKey(this.configs.privateKey), 'base64');

    return { ...params, sign };
  }

  /**
   * Verify Alipay notification signature
   */
  private verifySignature(params: Record<string, string>): boolean {
    const sign = params.sign;
    const signType = params.sign_type || this.configs.signType || 'RSA2';

    if (!sign) return false;

    // Build verification string (exclude sign and sign_type)
    const sortedKeys = Object.keys(params)
      .filter((k) => k !== 'sign' && k !== 'sign_type')
      .sort();
    const signStr = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== '')
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    const algorithm = signType === 'RSA2' ? 'RSA-SHA256' : 'RSA-SHA1';

    return crypto
      .createVerify(algorithm)
      .update(signStr, 'utf-8')
      .verify(
        this.normalizePublicKey(this.configs.alipayPublicKey),
        sign,
        'base64'
      );
  }

  private mapAlipayStatus(status: string): PaymentStatus {
    switch (status) {
      case 'TRADE_SUCCESS':
      case 'TRADE_FINISHED':
        return PaymentStatus.SUCCESS;
      case 'TRADE_CLOSED':
        return PaymentStatus.CANCELED;
      case 'WAIT_BUYER_PAY':
        return PaymentStatus.PROCESSING;
      default:
        return PaymentStatus.PROCESSING;
    }
  }

  private formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private normalizePrivateKey(key: string): string {
    if (key.includes('-----BEGIN')) return key;
    return `-----BEGIN RSA PRIVATE KEY-----\n${key}\n-----END RSA PRIVATE KEY-----`;
  }

  private normalizePublicKey(key: string): string {
    if (key.includes('-----BEGIN')) return key;
    return `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
  }
}

/**
 * Create Alipay provider with configs
 */
export function createAlipayProvider(configs: AlipayConfigs): AlipayProvider {
  return new AlipayProvider(configs);
}
