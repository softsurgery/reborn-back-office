import { MailService } from "./mail/services/mail.service";
import { resolveMX } from "./mail/utils/mx-resolve.util";

export const getMailServiceRef = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const { host: smtpHost, port: smtpPort } = await resolveMX(
      process.env.SMTP_USER.split("@")[1]
    );
    return new MailService(
      smtpHost,
      smtpPort,
      process.env.SMTP_USER,
      process.env.SMTP_PASS
    );
  }
  throw new Error("SMTP_USER or SMTP_PASS not set");
};

export const mailService = getMailServiceRef();