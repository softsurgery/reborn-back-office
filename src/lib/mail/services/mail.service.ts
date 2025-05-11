import nodemailer, { Transporter } from "nodemailer";
import { resolveMX } from "../utils/mx-resolve.util";
import fs from "fs/promises";
import path from "path";
import { TemplateService } from "./template.service";

export class MailService {
  private templateService: TemplateService;
  private transporter: Transporter;
  private smtpUser: string;

  constructor(templateService: TemplateService) {
    this.templateService = templateService;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP_USER or SMTP_PASS is not set in environment");
    }

    this.smtpUser = smtpUser;

    const domain = smtpUser.split("@")[1];
    const port = Number(process.env.SMTP_PORT) || 587;

    this.transporter = nodemailer.createTransport({
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

    if (!process.env.SMTP_HOST) {
      resolveMX(domain)
        .then(({ host }) => {
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
        })
        .catch((err) => {
          console.warn(
            "Failed to resolve MX. Using fallback host:",
            err.message
          );
        });
    }
  }

  async renderTemplateFromDb(
    templateName: string,
    variables: Record<string, string>
  ): Promise<string> {
    const template = await this.templateService.getTemplateByName(templateName);
    if (!template?.markdownContent) {
      throw new Error(`Template "${templateName}" not found or has no content`);
    }

    let content = template.markdownContent;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      content = content.replace(regex, value);
    }

    return content;
  }

  async sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any>
  ) {
    const html = await this.renderTemplateFromDb(templateName, variables);
    return this.sendMail(to, subject, html);
  }

  async sendMail(to: string, subject: string, html: string, text?: string) {
    const info = await this.transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${this.smtpUser}>`,
      to,
      subject,
      html,
      text,
    });
    return info;
  }
}
