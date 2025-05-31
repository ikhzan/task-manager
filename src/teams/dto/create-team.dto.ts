import { IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  members: string[]; // Array of user IDs
}