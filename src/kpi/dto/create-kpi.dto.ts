import { IsString, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateKpiDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['daily', 'weekly', 'monthly'])
  frequency: 'daily' | 'weekly' | 'monthly';

  @IsNumber()
  @IsNotEmpty()
  target: number;

  @IsString()
  @IsNotEmpty()
  owner: string; // ✅ User ID
}