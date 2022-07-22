import { createTransport } from "nodemailer";
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from "../config";

export const mailer = createTransport({
  host: MAIL_HOST,
  port: +MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
