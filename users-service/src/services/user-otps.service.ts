import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserOtp} from "../models/user-otps.model";
import {GeneralHelper} from "../../../shared/helpers";
import {BaseService} from "../../../shared/base/base-service";
import {MESSAGE_PATTERNS, MICRO_SERVICES} from "../../../shared/constants";
import {ClientProxy} from "@nestjs/microservices";


@Injectable()
export class UserOtpService extends BaseService{
    constructor(
        @InjectModel(UserOtp) private userOtpModel: typeof UserOtp,
        @Inject(MICRO_SERVICES.MAILER_SERVICE) private readonly mailClient: ClientProxy
    ) {
        super(UserOtp);
    }

    async create(data): Promise<UserOtp> {
        /* delete previous otp */
        await this.userOtpModel.destroy({
            where: {
                email: data.email
            },
            force: true
        });
        /* create otp */
        const otp = GeneralHelper.generateOTP();
        const user_otp =  await this.userOtpModel.create({
            email: data.email,
            otp: otp
        });
        /* send email */
        this.mailClient.emit(MESSAGE_PATTERNS.SEND_MAIL,{
            to: data.email,
            subject: 'Welcome to the App!',
            html: `<p>OTP Code: ${otp}</p>`,
        });
        return user_otp;
    }

}
