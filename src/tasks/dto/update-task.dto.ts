import { IsString, IsBoolean, IsOptional, IsNumber, IsArray, IsEnum, IsMongoId } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumber()
  timelineWeeks?: number;

  @IsOptional()
  deadline?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures all elements are strings
  tags?: string[];

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  priority?: string = 'medium'; // Default priority

  @IsOptional()
  @IsMongoId()
  team?: string;

}