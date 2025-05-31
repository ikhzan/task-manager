import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type KpiDocument = Kpi & Document;

@Schema()
export class Kpi {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly'] }) // ✅ Track KPI frequency
  frequency: string;

  @Prop({ required: true }) // ✅ Target value for KPI measurement
  target: number;

  @Prop({ type: Map, of: Number, default: {} }) // ✅ Store actual performance values
  performanceData: Map<string, number>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // ✅ Associate KPI with a user/team
  owner: Types.ObjectId;
}

export const KpiSchema = SchemaFactory.createForClass(Kpi);