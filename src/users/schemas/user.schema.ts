import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true }) // Ensure email is unique
  email: string;

  @Prop({ type: [String], default: [] }) // Store team IDs for membership
  teams: string[];

  @Prop({ type: [String], enum: ['admin', 'member'], default: ['member'] }) // User roles in teams
  roles: string[];

  @Prop({ required: false }) // ✅ Store JWT token after login
  accessToken?: string;

  @Prop({ required: false }) // ✅ Store JWT token after login
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);