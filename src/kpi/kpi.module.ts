import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Kpi, KpiSchema } from './kpi.schema';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
   imports: [
    UsersModule,
    TasksModule,
    MongooseModule.forFeature([{ name: Kpi.name, schema: KpiSchema }])
  ],
  controllers: [KpiController],
  providers: [KpiService],
  exports: [KpiService, MongooseModule],

})
export class KpiModule {}
