import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

export class Company {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class Job {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId
}

export class CreateUserDto {
    @IsEmail({}, { message: 'Email does not value' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string

    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string

    @IsNotEmpty({ message: 'Age should not be empty' })
    age: number

    @IsNotEmpty({ message: 'Address should not be empty' })
    address: string

    @IsNotEmpty({ message: 'Gender should not be empty' })
    gender: string

    @IsNotEmpty({ message: 'Role should not be empty' })
    role: string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company
}

export class RegisterUserDto {
    @IsEmail({}, { message: 'Email does not value' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string

    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string

    @IsNotEmpty({ message: 'Age should not be empty' })
    age: number

    @IsNotEmpty({ message: 'Address should not be empty' })
    address: string

    @IsNotEmpty({ message: 'Gender should not be empty' })
    gender: string

    // @IsNotEmpty({ message: 'Role should not be empty' })
    role: string

    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => Company)
    // company: Company
}