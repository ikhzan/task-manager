import { IsArray, IsMongoId } from "class-validator";

export class UpdateTeamMembersDto {
  @IsArray()
  @IsMongoId({ each: true })
  members: string[];
}