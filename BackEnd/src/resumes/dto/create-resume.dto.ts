import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty} from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
   // @IsNotEmpty({ message: 'Email should not empty' })
   // email: string

   @IsNotEmpty({ message: 'Url should not empty' })
   url: string

   @IsNotEmpty()
   @IsMongoId()
   companyId: mongoose.Schema.Types.ObjectId

   @IsNotEmpty()
   @IsMongoId()
   jobId: mongoose.Schema.Types.ObjectId
   
   // @IsNotEmpty({ message: 'Status should not empty' })
   // status: string
}