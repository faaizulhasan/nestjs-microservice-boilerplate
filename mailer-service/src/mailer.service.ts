import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {SendMailDto} from "../../shared/dtos/mail.dto";
import {MAIL_CREDENTIALS} from "../../shared/constants";


@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: MAIL_CREDENTIALS.HOST,
    port: MAIL_CREDENTIALS.PORT,
    secure: true,
    requireTLS: true,
    auth: {
      user: MAIL_CREDENTIALS.USER,
      pass: MAIL_CREDENTIALS.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  async sendMail(payload: SendMailDto) {
    const mailOptions = {
      from: MAIL_CREDENTIALS.FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
