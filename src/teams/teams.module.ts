import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamService } from './team.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
      forwardRef(() => AuthModule),
        UsersModule,
        MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
  ],
  providers: [TeamService],
  controllers: [TeamsController],
  exports: [MongooseModule],
})
export class TeamsModule {}
