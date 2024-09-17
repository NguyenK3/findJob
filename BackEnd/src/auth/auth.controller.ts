import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/customize/customizeDecoration';
import { LocalAuthGuard } from './local/local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { request, Request, Response } from 'express';
import { IUsers } from 'src/users/interface/users.interface';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  async register(@Body() registerUserDTO: RegisterUserDto) {
    return this.authService.register(registerUserDTO)
  }

  @ResponseMessage('Get an information of user')
  @Get('/account')
  async account(@User() user:IUsers) {
    return {user}
  }

  @ResponseMessage('Get User by refresh Token')
  @Public()
  @Get('/refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response ) {
    const refresh_Token = request.cookies['refresh_token']
    return this.authService.processNewToken(refresh_Token, response)
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @User() user:IUsers
  ) {
    return this.authService.logout(user, response)
  }


  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  @Render('home')
  getHello() {
    // return this.appService.getHello();
  }
}