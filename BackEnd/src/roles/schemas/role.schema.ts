import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Permission } from "src/permissions/schemas/permission.schema";

@Schema({timestamps: true})
export class Role { 
   @Prop()
   name: string

   @Prop()
   description: string

   @Prop()
   isActive: boolean

   @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
   permissions: []

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

export const RoleSchema = SchemaFactory.createForClass(Role)
