import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsNotEmpty({ message: 'Company name should not be empty' })
    companyName: string

    @IsNotEmpty({ message: 'Address should not be empty' })
    address: string

    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string
}
