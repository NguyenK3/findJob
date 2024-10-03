import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Company } from 'src/company/schemas/company.schema';
import { Jobs } from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {

   @Prop()
   email: string

   @Prop()
   userId: mongoose.Schema.Types.ObjectId

   @Prop()
   url: string

   @Prop()
   status: string

   @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})
   companyId: mongoose.Schema.Types.ObjectId

   @Prop({type: mongoose.Schema.Types.ObjectId, ref: Jobs.name})
   jobId: mongoose.Schema.Types.ObjectId

   @Prop({type: mongoose.Schema.Types.Array})
   history: {
      status: string,
      updateAt: Date,
      updateBy: {
         _id: mongoose.Schema.Types.ObjectId,
         email: string
      }
   }[]

   @Prop({ type: Object })
   createdBy: {
      _id: mongoose.Schema.Types.ObjectId
      email: string
   }

   @Prop({ type: Object })
   updatedBy: {
      _id: mongoose.Schema.Types.ObjectId
      email: string
   }

   @Prop({ type: Object })
   deletedBy: {
      _id: mongoose.Schema.Types.ObjectId
      email: string
   }

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;

   @Prop()
   isDeleted: boolean

   @Prop()
   deletedAt: Date
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);