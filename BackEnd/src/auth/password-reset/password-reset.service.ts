import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PasswordResetService {
  private otpStore = new Map<string, { otp: string; expires: Date }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  async requestReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    this.otpStore.set(email, { otp, expires });

    await this.emailService.sendResetOtp(email, otp); // Implement phương thức này

    return { message: 'OTP đã được gửi đến email' };
  }

  async verifyOtp(email: string, otp: string) {
    const record = this.otpStore.get(email);
    if (!record || record.otp !== otp || record.expires < new Date()) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
    }
    return { message: 'OTP hợp lệ' };
  }

  async resetPassword(email: string, newPassword: string, otp: string) {
    await this.verifyOtp(email, otp);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);
    this.otpStore.delete(email);
    return { message: 'Đặt lại mật khẩu thành công' };
  }
}