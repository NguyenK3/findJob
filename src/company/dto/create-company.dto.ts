import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Company name should not be empty' })
    name: string

    @IsNotEmpty({ message: 'Address should not be empty' })
    address: string

    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string
}