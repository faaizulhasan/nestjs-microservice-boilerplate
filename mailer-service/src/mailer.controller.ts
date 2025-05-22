import {Controller, Get} from '@nestjs/common';
import {MailerService} from './mailer.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {USER_MESSAGE_PATTERNS} from "../../shared/constants";

@Controller()
export class MailerController {
  constructor(private readonly mailer: MailerService) {}

  @Get()
  @MessagePattern(USER_MESSAGE_PATTERNS.SEND_MAIL)
  async handleSendEmail(@Payload() payload) {
    console.log("payload:",payload)
    return this.mailer.sendMail(payload);
  }
}
