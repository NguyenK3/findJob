import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, {message: 'Email does not value'})
    @IsNotEmpty({ message: 'Email should not be empty'})
    email: string

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string

    username: string
    address: string
}