import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { TaskSchema } from './schemas/task.schema';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    TeamsModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
