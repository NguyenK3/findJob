import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/customize/customizeDecoration';
import { LocalAuthGuard } from './local/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @Render('home')
  getHello() {
    // return this.appService.getHello();
  }
}