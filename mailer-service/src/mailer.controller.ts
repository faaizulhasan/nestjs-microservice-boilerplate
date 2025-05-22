import {Controller, Get} from '@nestjs/common';
import {MailerService} from './mailer.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {MESSAGE_PATTERNS} from "../../shared/constants";

@Controller()
export class MailerController {
  constructor(private readonly mailer: MailerService) {}

  @Get()
  @MessagePattern(MESSAGE_PATTERNS.SEND_MAIL)
  async handleSendEmail(@Payload() payload) {
    console.log("payload:",payload)
    return this.mailer.sendMail(payload);
  }
}
