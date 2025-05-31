import { Types } from 'mongoose';

export class GetKpiDto {
  _id: Types.ObjectId;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  user: Types.ObjectId;
  performanceData: Record<string, number>;
}