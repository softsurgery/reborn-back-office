import nodemailer from "nodemailer";

export class MailService {
  private transporter;
  private smtpuser;

  constructor(
    smtpHost: string,
    smtpPort: number,
    smtpUser: string,
    smtpPass: string
  ) {
    this.smtpuser = smtpUser;
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
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
  }

  async sendMail(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from: `"Reborn" <${this.smtpuser}>`,
      to,
      subject,
      html,
    });

    return info;
  }
}
