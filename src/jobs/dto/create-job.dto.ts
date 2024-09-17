import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
   @IsString()
   _id: mongoose.Schema.Types.ObjectId

   @IsNotEmpty()
   name: string
}

export class CreateJobDto {
   @IsNotEmpty({ message: 'Name should not be empty' })
   name: string

   @IsNotEmpty({ message: 'Skills should not be empty' })
   skills: string[]

   // @IsNotEmpty({ message: 'Location should not be empty' })
   location: string

   @IsNotEmpty({ message: 'Salary should not be empty' })
   salary: number

   @IsNotEmpty({ message: 'Quantity should not be empty' })
   quantity: string

   @IsNotEmpty({ message: 'Level should not be empty' })
   level: string

   @IsNotEmpty({ message: 'Description should not be empty' })
   description: string

   @IsNotEmpty({ message: 'Start Date should not be empty' })
   startDate: Date

   @IsNotEmpty({ message: 'End Date should not empty' })
   endDate: Date

   isActive: boolean

   @IsNotEmptyObject()
   @IsObject()
   @ValidateNested()
   @Type(() => Company)
   company: Company
}
