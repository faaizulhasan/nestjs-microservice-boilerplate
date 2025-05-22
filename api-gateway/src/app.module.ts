import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UserProxyController} from "./user-proxy.controller";
import {JWT_SECRET, MICRO_SERVICES} from "../../shared/constants";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICRO_SERVICES.USERS_SERVICE,
        transport: Transport.REDIS,
        options: { port: 6379, host: 'localhost' },
      }
    ]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserProxyController],
  providers: [AppService],
})
export class AppModule {}
