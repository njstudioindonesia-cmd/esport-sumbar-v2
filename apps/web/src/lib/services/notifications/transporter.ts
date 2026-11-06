import { logger } from "@esport-sumbar/lib";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isMock?: boolean;
}

export interface EmailTransporter {
  send(message: EmailMessage): Promise<SendEmailResult>;
}

/**
 * Provider Pengiriman Email Mock untuk Pengujian & Pengembangan Lokal
 */
export class MockEmailTransporter implements EmailTransporter {
  public sentMessages: EmailMessage[] = [];
  public shouldFail: boolean = false;
  public failureMessage: string = "Simulated SMTP connection timeout";

  async send(message: EmailMessage): Promise<SendEmailResult> {
    if (this.shouldFail) {
      logger.warn("Mock email transport simulasi kegagalan", { to: message.to, subject: message.subject });
      return {
        success: false,
        error: this.failureMessage,
        isMock: true,
      };
    }

    this.sentMessages.push(message);
    const messageId = `mock-${crypto.randomUUID()}`;
    logger.info("Mock email terkirim", { to: message.to, subject: message.subject, messageId });

    return {
      success: true,
      messageId,
      isMock: true,
    };
  }

  clear(): void {
    this.sentMessages = [];
    this.shouldFail = false;
  }
}

/**
 * Provider Pengiriman Email HTTP API (Resend / Custom Webhook)
 */
export class HttpEmailTransporter implements EmailTransporter {
  private apiKey: string;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom = "ESPORT SUMBAR <noreply@esportsumbar.com>") {
    this.apiKey = apiKey;
    this.defaultFrom = defaultFrom;
  }

  async send(message: EmailMessage): Promise<SendEmailResult> {
    try {
      // Panggilan REST API Resend (atau penyedia email serupa)
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from || this.defaultFrom,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        return {
          success: false,
          error: `Penyedia email merespons status ${res.status}: ${errorBody}`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data.id || `msg-${crypto.randomUUID()}`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Kesalahan koneksi email";
      logger.error("Gagal mengirim email via HTTP provider", { error: err });
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}

// Inisialisasi default transporter
const globalMockTransporter = new MockEmailTransporter();
let activeTransporter: EmailTransporter = globalMockTransporter;

if (process.env.RESEND_API_KEY) {
  activeTransporter = new HttpEmailTransporter(process.env.RESEND_API_KEY);
}

export function getEmailTransporter(): EmailTransporter {
  return activeTransporter;
}

export function setEmailTransporter(transporter: EmailTransporter): void {
  activeTransporter = transporter;
}

export function getMockTransporter(): MockEmailTransporter {
  return globalMockTransporter;
}

/**
 * Fungsi Pengiriman Email dengan Isolasi Kegagalan (Fault-Isolated):
 * Kegagalan pengiriman email TIDAK PERNAH melempar exception (throw) ke pemanggil
 * agar tidak menggagalkan transaksi bisnis utama.
 */
export async function sendEmailSafe(message: EmailMessage): Promise<SendEmailResult> {
  try {
    const transporter = getEmailTransporter();
    return await transporter.send(message);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Kesalahan sistem pengiriman email";
    logger.error("Email dispatch caught unexpected error", { error: err });
    return {
      success: false,
      error: errorMsg,
    };
  }
}
