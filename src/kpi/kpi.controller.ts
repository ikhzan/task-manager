import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { Kpi } from './kpi.schema';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';

@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get()
  async fetchKpi() {
    return this.kpiService.getKpi();
  }

  @Post('/create')
  async createKpi(@Body() body: CreateKpiDto) {
    return this.kpiService.createKpi(body);
  }

  @Patch('/update/:kpiId')
  async updateKpi(@Param('kpiId') kpiId: string, @Body() body: UpdateKpiDto) {
    return this.kpiService.updateKpi(kpiId, body);
  }

  @Get('/:kpiId')
  async getKpiById(@Param('kpiId') kpiId: string) {
    return this.kpiService.getKpiById(kpiId);
  }

  @Get('/user/:userId')
  async getUserKpis(@Param('userId') userId: string) {
    return this.kpiService.getUserKpis(userId);
  }

  @Delete('/delete/:kpiId')
  async deleteKpi(@Param('kpiId') kpiId: string) {
    return this.kpiService.deleteKpi(kpiId);
  }


  @Post('/update-performance/:kpiId')
  async updatePerformance(@Param('kpiId') kpiId: string, @Body() body: { date: string; value: number }) {
    return this.kpiService.updatePerformance(kpiId, body.date, body.value);
  }

  @Get('/progress/:kpiId')
  async getKpiProgress(@Param('kpiId') kpiId: string) {
    return this.kpiService.getKpiProgress(kpiId);
  }

  @Get('/user/:userId')
  async getUserKpi(@Param('userId') userId: string) {
    return this.kpiService.getUserKpi(userId);
  }

  @Get('/task-completion-rate/:userId')
  async getTaskCompletionRate(@Param('userId') userId: string) {
    return {
      userId,
      completionRate: await this.kpiService.getTaskCompletionRate(userId),
    };
  }

  @Get('/average-completion-time/:userId')
  async getAverageCompletionTime(@Param('userId') userId: string) {
    return {
      userId,
      averageCompletionTime: await this.kpiService.getAverageCompletionTime(userId),
    };
  }


}
