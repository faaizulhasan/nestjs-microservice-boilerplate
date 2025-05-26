import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {SendMailDto} from "../../shared/dtos/mail.dto";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAIL_HOST"),
      port: this.configService.get<number>("MAIL_PORT"),
      secure: true,
      requireTLS: true,
      auth: {
        user: this.configService.get<string>("MAIL_USER"),
        pass: this.configService.get<string>("MAIL_PASSWORD")
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendMail(payload: SendMailDto) {
    const mailOptions = {
      from: this.configService.get<string>("MAIL_FROM"),
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
