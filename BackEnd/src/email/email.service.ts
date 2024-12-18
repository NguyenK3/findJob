import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // this.transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: this.configService.get<string>('EMAIL_USER'),
    //     pass: this.configService.get<string>('EMAIL_PASS'),
    //   },
    // });
    console.log(this.configService.get<string>('EMAIL_USER'));
    console.log(this.configService.get<string>('EMAIL_PASS'));
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      logger: true,
      debug: true,
    });
  }

  async sendResetOtp(email: string, otp: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      // to: email,
      to: this.configService.get<string>('EMAIL_USER'),
      subject: 'Reset Password OTP',
      text: `Your OTP for resetting password is: ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}