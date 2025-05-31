import { Types } from 'mongoose';

export class Task {
  id: string; // Use string for MongoDB ObjectId
  title: string;
  description: string;
  completed: boolean;
  user: Types.ObjectId; 
  deadline?: Date; // Completion deadline (specific date)
  timelineWeeks?: number; // Expected timeline in weeks
  tags?: string[]; // Categorization tags
}
