import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type JobsDocument = HydratedDocument<Jobs>;

@Schema({ timestamps: true })
export class Jobs {
   @Prop()
   name: string;

   @Prop({ required: true })
   skills: string[];

   @Prop({ type: Object })
   company: {
      _id: mongoose.Schema.Types.ObjectId,
      name: string,
      logo: string
   }

   @Prop()
   location: string;

   @Prop()
   salary: number;

   @Prop()
   quantity: string;

   @Prop()
   level: string;

   @Prop()
   description: string

   @Prop()
   startDate: Date

   @Prop()
   endDate: Date

   @Prop()
   isActive: boolean

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

export const JobsSchema = SchemaFactory.createForClass(Jobs);