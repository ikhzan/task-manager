import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) // Reference multiple users
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Team admin
  owner: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Task', default: [] }) // Tasks assigned to the team
  tasks: Types.ObjectId[];

}

export const TeamSchema = SchemaFactory.createForClass(Team);