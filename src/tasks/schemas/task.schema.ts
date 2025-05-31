import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false }) 
  user?: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'Team' }) // Team task ownership
  team?: Types.ObjectId;

  @Prop({ type: Date }) // Task deadline (specific date)
  deadline?: Date;

  @Prop({ type: Number }) // Timeline in weeks (e.g., 1 week, 2 weeks)
  timelineWeeks?: number;

  @Prop({ type: [String], default: ['general'] }) // Tags for categorization
  tags?: string[];

  @Prop({ type: String, enum: ['low', 'medium', 'high'], default: 'medium' }) // Priority with default "medium"
  priority: string;

}

export const TaskSchema = SchemaFactory.createForClass(Task);