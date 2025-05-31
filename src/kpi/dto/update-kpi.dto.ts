import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateKpiDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['daily', 'weekly', 'monthly'])
  @IsOptional()
  frequency?: 'daily' | 'weekly' | 'monthly';

  @IsNumber()
  @IsOptional()
  target?: number;
}