import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
   @IsNotEmpty({ message: 'Name should not empty' })
   name: string

   @IsNotEmpty({ message: 'Description should not empty' })
   description: string

   @IsNotEmpty({ message: 'Is active should not empty' })
   isActive: boolean

   @IsMongoId({each: true, message: 'Each permission is mongo object id'})
   @IsArray({message: 'Permission should a array'})
   @IsNotEmpty({ message: 'Permission should not empty' })
   permissions: mongoose.Schema.Types.ObjectId[]

}
