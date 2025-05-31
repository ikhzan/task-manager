import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamService } from './team.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
  ],
  providers: [TeamService],
  controllers: [TeamsController],
  exports: [MongooseModule],
})
export class TeamsModule {}
