import { render } from '@react-email/components';

import type {
  EmailConfigs,
  EmailMessage,
  EmailProvider,
  EmailSendResult,
} from '.';

/**
 * Cloudflare Email Service provider configs
 * @docs https://developers.cloudflare.com/email-service/get-started/send-emails/
 */
export interface CloudflareEmailConfigs extends EmailConfigs {
  apiToken: string;
  accountId: string;
  defaultFrom?: string;
}

/**
 * Cloudflare Email Service provider implementation
 * Uses the REST API: POST /client/v4/accounts/{account_id}/email/sending/send
 */
export class CloudflareEmailProvider implements EmailProvider {
  readonly name = 'cloudflare';
  configs: CloudflareEmailConfigs;

  constructor(configs: CloudflareEmailConfigs) {
    this.configs = configs;
  }

  async sendEmail(email: EmailMessage): Promise<EmailSendResult> {
    try {
      const from = email.from || this.configs.defaultFrom || '';
      const to = Array.isArray(email.to) ? email.to[0] : email.to;

      let html = email.html;
      if (email.react) {
        html = await render(email.react);
      }

      const body: Record<string, any> = {
        from,
        to,
        subject: email.subject,
      };

      if (html) body.html = html;
      if (email.text) body.text = email.text;
      if (!html && !email.text) body.text = '';

      const url = `https://api.cloudflare.com/client/v4/accounts/${this.configs.accountId}/email/sending/send`;

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configs.apiToken}`,
        },
        body: JSON.stringify(body),
      });

      const data: any = await resp.json().catch(() => ({}));

      if (!resp.ok || data.success === false) {
        const errMsg =
          data?.errors?.[0]?.message ||
          data?.messages?.[0] ||
          `Request failed (${resp.status})`;
        return {
          success: false,
          error: errMsg,
          provider: this.name,
        };
      }

      return {
        success: true,
        messageId: data?.result?.delivered?.[0] || undefined,
        provider: this.name,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      };
    }
  }
}

/**
 * Create Cloudflare Email provider with configs
 */
export function createCloudflareEmailProvider(
  configs: CloudflareEmailConfigs
): CloudflareEmailProvider {
  return new CloudflareEmailProvider(configs);
}
