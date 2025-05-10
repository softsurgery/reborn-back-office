import nodemailer, { Transporter } from "nodemailer";
import { resolveMX } from "../utils/mx-resolve.util";

export class MailService {
  private transporter: Transporter;
  private smtpUser: string;

  constructor() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP_USER or SMTP_PASS is not set in environment");
    }

    this.smtpUser = smtpUser;

    const domain = smtpUser.split("@")[1];
    const port = Number(process.env.SMTP_PORT) || 587;

    this.transporter = nodemailer.createTransport({
      // Fallback to provided env host or resolve via MX
      host: process.env.SMTP_HOST || domain,
      port: port,
      secure: port === 465,
      pool: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      maxConnections: 5,
      maxMessages: 100,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Optional async DNS verification logic for MX if not set explicitly
    if (!process.env.SMTP_HOST) {
      resolveMX(domain).then(({ host }) => {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          pool: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          maxConnections: 5,
          maxMessages: 100,
          tls: {
            rejectUnauthorized: false,
          },
        });
      }).catch((err) => {
        console.warn("Failed to resolve MX. Using fallback host:", err.message);
      });
    }
  }

  async sendMail(to: string, subject: string, html: string, text?: string) {
    const info = await this.transporter.sendMail({
      from: `"Reborn" <${this.smtpUser}>`,
      to,
      subject,
      html,
      text,
    });

    return info;
  }
}
