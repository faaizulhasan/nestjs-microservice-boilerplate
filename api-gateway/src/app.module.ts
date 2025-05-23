import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UserProxyController} from "./user-proxy.controller";
import {JWT_EXPIRY, JWT_SECRET, MICRO_SERVICES, REDIS_CREDENTIALS} from "../../shared/constants";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICRO_SERVICES.USERS_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      }
    ]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  controllers: [UserProxyController],
  providers: [AppService],
})
export class AppModule {}
