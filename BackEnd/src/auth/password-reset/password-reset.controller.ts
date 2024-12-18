import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { RequestResetDto } from './dto/request-reset.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/customize/customizeDecoration';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) { }

  @Post('/request')
  @Public()
  async requestReset(@Body() requestResetDto: RequestResetDto) {
    return this.passwordResetService.requestReset(requestResetDto.email);
  }

  @Post('/verify-otp')
  @Public()
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.passwordResetService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('/reset')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.newPassword,
      resetPasswordDto.otp,
    );
  }
}