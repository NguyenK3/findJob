import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import { get } from "http";
import mongoose from "mongoose";

class Company {
   @IsString()
   _id: mongoose.Schema.Types.ObjectId

   @IsNotEmpty()
   name: string

   @IsNotEmpty()
   logo: string
}

export class CreateJobDto {
   @IsNotEmpty({ message: 'Name should not be empty' })
   name: string

   @IsNotEmpty({ message: 'Skills should not be empty' })
   @IsArray({ message: 'Skills should be Array' })
   @IsString({each: true, message: 'Skills should be string'})
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
   @Transform(({ value }) => new Date(value))
   @IsDate({message: 'Start Date should be date'})
   startDate: Date

   @IsNotEmpty({ message: 'End Date should not empty' })
   @Transform(({ value }) => new Date(value))
   @IsDate({ message: 'End Date should be date' })
   endDate: Date

   @IsNotEmpty({ message: 'IsActive should not empty' })
   @IsBoolean({message: 'IsActive should be boolean'})
   isActive: boolean

   @IsNotEmptyObject()
   @IsObject()
   @ValidateNested()
   @Type(() => Company)
   company: Company
}
