import { Injectable, NotFoundException } from '@nestjs/common';
import { Kpi, KpiDocument } from './kpi.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateKpiDto } from './dto/create-kpi.dto';

@Injectable()
export class KpiService {
 constructor(
    @InjectModel(Kpi.name) private readonly kpiModel: Model<KpiDocument>, 
    private readonly userService: UsersService, 
    private readonly taskService: TasksService, 
  ) {} // ✅ Correct model injection

    // ✅ Create KPI
  async createKpi(createKpiDto: CreateKpiDto): Promise<Kpi> {
    const userExists = await this.userService.findOne(createKpiDto.owner);
    if(!userExists){
      throw new NotFoundException(`User with Name ${createKpiDto.owner} not found`)
    }
    return this.kpiModel.create(createKpiDto);
  }

  // ✅ Retrieve KPI by ID
  async getKpiById(kpiId: string): Promise<Kpi> {
    const kpi = await this.kpiModel.findById(kpiId);
    if (!kpi) throw new NotFoundException(`KPI with ID ${kpiId} not found`);
    return kpi;
  }

  // ✅ Retrieve all KPIs for a user
  async getUserKpis(userId: string): Promise<Kpi[]> {
    return this.kpiModel.find({ user: userId });
  }

  // ✅ Update KPI
  async updateKpi(kpiId: string, updateData: Partial<Kpi>): Promise<Kpi> {
    const kpi = await this.kpiModel.findByIdAndUpdate(kpiId, updateData, { new: true });
    if (!kpi) throw new NotFoundException(`KPI with ID ${kpiId} not found`);
    return kpi;
  }

  // ✅ Delete KPI
  async deleteKpi(kpiId: string): Promise<{ message: string }> {
    const kpi = await this.kpiModel.findByIdAndDelete(kpiId);
    if (!kpi) throw new NotFoundException(`KPI with ID ${kpiId} not found`);
    return { message: 'KPI deleted successfully' };
  }

  async updatePerformance(kpiId: string, date: string, value: number): Promise<Kpi> {
    const updatedKpi = await this.kpiModel.findByIdAndUpdate(
      kpiId,
      { $set: { [`performanceData.${date}`]: value } },
      { new: true }
    );
    if (!updatedKpi) {
      throw new Error("KPI not found");
    }
    return updatedKpi;
  }

  async getKpiProgress(kpiId: string): Promise<any> {
    const kpi = await this.kpiModel.findById(kpiId);
    if (!kpi) throw new Error("KPI not found");

    const performanceValues = [...kpi.performanceData.values()];
    const averagePerformance = performanceValues.reduce((a, b) => a + b, 0) / performanceValues.length || 0;

    return { name: kpi.name, target: kpi.target, currentAverage: averagePerformance };
  }

  // ✅ Calculate User Task Completion Rate
  async getTaskCompletionRate(userId: string): Promise<number> {
    const totalTasks = await this.taskService.countTasksByUser(userId); // ✅ Fetch from TaskService
    const completedTasks = await this.taskService.countCompletedTasksByUser(userId);

    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100; // Completion Rate %
  }
 // ✅ Calculate Average Completion Time
  async getAverageCompletionTime(userId: string): Promise<number> {
    const tasks = await this.taskService.getCompletedTasksByUser(userId);
    const totalTime = tasks.reduce((sum, task) => sum + (task.completionTime || 0), 0);
    return tasks.length === 0 ? 0 : totalTime / tasks.length; // Average completion time
  }

  // ✅ Get Total Revisions for a User
  async getTaskRevisions(userId: string): Promise<number> {
    const tasks = await this.taskService.getTasksByUser(userId);
    return tasks.reduce((sum, task) => sum + (task.revisions || 0), 0); // Total revisions across tasks
  }


  // ✅ Get Full KPI Data for a User
  async getUserKpi(userId: string): Promise<any> {
    return {
      completionRate: await this.getTaskCompletionRate(userId),
      avgCompletionTime: await this.getAverageCompletionTime(userId),
      taskRevisions: await this.getTaskRevisions(userId),
    };
  }

}
