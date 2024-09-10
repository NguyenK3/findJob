import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUsers } from 'src/users/interface/users.interface';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.isValidEmail(username);

        if (user) {
            const isValid = await this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                return user
            }
        }

        return null;
    }

    async login(user: IUsers) {
        const {_id, email, name, role} = user
        const payload = { 
            iss: 'from server', 
            sub: 'Token login',
            _id,
            email,
            name,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            email,
            name,
            role
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        let newUser = await this.usersService.register(registerUserDto)
        return {
            _id: newUser?._id,
            createAt: newUser?.createdAt
        }
    }
}
