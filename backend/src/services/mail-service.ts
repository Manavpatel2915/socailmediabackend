import transporter from "../config/mailer";
import { env } from "../config/env.config"

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async ({ to, subject, text, html }: MailOptions): Promise<void> => {
  const mailOptions = {
    from: `"Your App" <${env.MAILER.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
};