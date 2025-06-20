import { IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  ownerId: string;

  @IsArray()
  @IsMongoId({ each: true })
  members: string[];
}