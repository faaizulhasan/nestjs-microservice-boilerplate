import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UserProxyController} from "./user-proxy.controller";
import {MICRO_SERVICES} from "../../shared/constants";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICRO_SERVICES.USERS_SERVICE,
        transport: Transport.REDIS,
        options: { port: 6379, host: 'localhost' },
      }
    ]),
  ],
  controllers: [UserProxyController],
  providers: [AppService],
})
export class AppModule {}
