import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUsers } from 'src/users/interface/users.interface';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleSevice: RolesService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.isValidEmail(username);

        if (user) {
            const isValid = await this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                const userRole = user.role as unknown as {
                    _id: string
                    name: string
                }

                const temp = await this.roleSevice.findOne(userRole._id)

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }

                return objUser
            }
        }

        return null;
    }

    async login(user: IUsers, response: Response) {
        const { _id, email, name, role, permissions } = user
        const payload = {
            iss: 'from server',
            sub: 'Token login',
            _id,
            email,
            name,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        await this.usersService.updateUserRefreshToken(_id, refresh_token)

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            //milisecond
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED_IN')) * 1000
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                email,
                name,
                role,
                permissions
            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        let newUser = await this.usersService.register(registerUserDto)
        return {
            _id: newUser?._id,
            createAt: newUser?.createdAt
        }
    }

    createRefreshToken = (payload) => {
        const refesh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED_IN')) / 1000
        })

        return refesh_token
    }


    processNewToken = async (refresh_Token: string, response: Response) => {
        try {
            this.jwtService.verify(refresh_Token, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })

            let user = await this.usersService.findUserByToken(refresh_Token)

            if (user) {
                const { _id, email, name, role } = user;
                const payload = {
                    iss: 'from server',
                    sub: 'Token Refresh',
                    _id,
                    email,
                    name,
                    role
                };

                const refresh_token = this.createRefreshToken(payload);

                await this.usersService.updateUserRefreshToken(_id.toString(), refresh_token);

                const userRole = user.role as unknown as {
                    _id: string
                    name: string
                }

                const temp = await this.roleSevice.findOne(userRole._id)

                response.cookie('refresh_token1', refresh_token, {
                    httpOnly: true,
                    secure: true,
                    //milisecond
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED_IN')) * 1000
                });

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        email,
                        name,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };

            } else {
                throw new BadRequestException('Refresh token is not valid');
            }

        } catch (error) {
            throw new BadRequestException('Refresh token is not valid')
        }
    }

    logout = async (user: IUsers, response: Response) => {
        await this.usersService.updateUserRefreshToken(user._id, '')
        response.clearCookie('refresh_token')
        return 'ok'
    }
}
