import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TeamsModule } from './teams/teams.module';
import { KpiService } from './kpi/kpi.service';
import { KpiController } from './kpi/kpi.controller';
import { KpiModule } from './kpi/kpi.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      serveRoot: '/'
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/task-manager'),
    TasksModule, 
    UsersModule, 
    AuthModule, 
    TeamsModule, 
    KpiModule, 
  ],
  controllers: [AppController, KpiController],
  providers: [AppService, KpiService],
})
export class AppModule {}
