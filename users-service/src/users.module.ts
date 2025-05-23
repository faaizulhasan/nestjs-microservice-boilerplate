import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './services/users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./models/users.model";
import {DATABASE_CREDENTIALS, JWT_SECRET, MICRO_SERVICES, REDIS_CREDENTIALS} from "../../shared/constants";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UserApiToken} from "./models/user-api-tokens.model";
import {UserOtp} from "./models/user-otps.model";
import {Role} from "./models/roles.model";
import {UserOtpService} from "./services/user-otps.service";
import {UserApiTokensService} from "./services/user-api-tokens.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICRO_SERVICES.MAILER_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS
      }
    ]),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: DATABASE_CREDENTIALS.DB_HOST,
      port: DATABASE_CREDENTIALS.DB_PORT,
      username: DATABASE_CREDENTIALS.DB_USER,
      password: DATABASE_CREDENTIALS.DB_PASSWORD,
      database: DATABASE_CREDENTIALS.DB_NAME,
      autoLoadModels: true,
      synchronize: true
    }),
    SequelizeModule.forFeature([User, UserApiToken, UserOtp, Role]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService,UserOtpService, UserApiTokensService],
  exports: [UsersService,UserOtpService],
})
export class UsersModule {}
