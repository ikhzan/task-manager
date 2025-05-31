import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KpiService } from './kpi.service';

@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Post('/create')
  async createKpi(@Body() body: { name: string; frequency: string; target: number; owner: string }) {
    return this.kpiService.createKpi(body.name, body.frequency, body.target, body.owner);
  }

  @Post('/update/:kpiId')
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
