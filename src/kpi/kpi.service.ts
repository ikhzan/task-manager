import { Injectable, NotFoundException } from '@nestjs/common';
import { Kpi, KpiDocument } from './kpi.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { Task, TaskDocument } from 'src/tasks/schemas/task.schema';

@Injectable()
export class KpiService {
 constructor(
    @InjectModel(Kpi.name) private readonly kpiModel: Model<KpiDocument>, 
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>, 
    private readonly userService: UsersService, 
  ) {} // ✅ Correct model injection


  async createKpi(name: string, frequency: string, target: number, owner: string): Promise<Kpi> {
    const userExists = await this.userService.findOne(owner); // ✅ Verify user existence

   if (!userExists) {
      throw new NotFoundException(`User with ID ${owner} not found`); // ✅ Structured error response
    }

    return this.kpiModel.create({ name, frequency, target, owner });
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

  async getTaskCompletionRate(userId: string): Promise<number> {
    const totalTasks = await this.taskModel.countDocuments({ user: userId });
    const completedTasks = await this.taskModel.countDocuments({ user: userId, completed: true });

    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100; // ✅ Completion Rate %
  }

  async getAverageCompletionTime(userId: string): Promise<number> {
    const tasks = await this.taskModel.find({ user: userId, completed: true });

    const totalTime = tasks.reduce((sum, task) => sum + (task.completionTime || 0), 0);
    return tasks.length === 0 ? 0 : totalTime / tasks.length; // ✅ Average completion time
  }

  async getTaskRevisions(userId: string): Promise<number> {
    const tasks = await this.taskModel.find({ user: userId });
    return tasks.reduce((sum, task) => sum + (task.revisions || 0), 0); // ✅ Total revisions across tasks
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
