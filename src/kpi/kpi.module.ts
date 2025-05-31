import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Kpi, KpiSchema } from './kpi.schema';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { UsersModule } from 'src/users/users.module';

@Module({
   imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Kpi.name, schema: KpiSchema }]) // ✅ Registers KPI model in Mongoose
  ],
  controllers: [KpiController],
  providers: [KpiService],
  exports: [MongooseModule],

})
export class KpiModule {}
