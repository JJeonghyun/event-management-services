import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
    default: ['USER'],
  })
  roles: string[];

  @Prop({ required: true, unique: true })
  referralCode: string;

  @Prop({ default: false })
  isFirstLogin: boolean;

  @Prop({ default: false })
  isReferral: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
