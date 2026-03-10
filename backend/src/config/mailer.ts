import nodemailer from "nodemailer";
import { env } from "./env.config"

const transporter = nodemailer.createTransport({
  host: String(env.MAILER.MAIL_HOST),
  port: Number(env.MAILER.MAIL_PORT),
  secure: false,
  auth: {
    user: String(env.MAILER.MAIL_USER),
    pass: String(env.MAILER.MAIL_PASS),
  },
});

export default transporter;