import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, IsMongoId } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional() // Make this optional if not required
  description?: string;

  @IsOptional()
  @IsString()
  user?: string; 

  @IsOptional()
  @IsNumber()
  timelineWeeks?: number = 1; // Default 1 week if not provided

  @IsOptional()
  deadline?: Date; // Can be auto-calculated from timelineWeeks

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures every item in the array is a string
  tags?: string[] = ['general']; // Default tag

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  priority?: string = 'medium'; // Default priority

  @IsOptional()
  @IsMongoId()
  team?: string; // Optional: Task assigned to a team

}
