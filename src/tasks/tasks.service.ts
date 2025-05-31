import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Team, TeamDocument } from 'src/teams/schemas/team.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>, 
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>
  ){}

  async createTaskForTeam(createTaskDto: CreateTaskDto): Promise<Task> {
    // Validate team exists
    const teamExists = await this.teamModel.findById(createTaskDto.team);
    if (!teamExists) {
      throw new Error("Team does not exist. Please create the team first.");
    }

    // Create the task and assign it to the team
    const task = new this.taskModel(createTaskDto);
    task.team = new Types.ObjectId(createTaskDto.team);
    
    // ✅ Save the task first
    await task.save();

    // ✅ Push the task ID to the team's tasks array
    await this.teamModel.findByIdAndUpdate(
      createTaskDto.team,
      { $push: { tasks: task._id } },
      { new: true }
    ).exec();

    return task;
  }
  
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Validate that the task belongs to either a user or a team (but not both)
    if (!createTaskDto.user && !createTaskDto.team) {
      throw new Error('Task must be assigned to either a user or a team.');
    }

    // Create a new task instance
    const task = new this.taskModel(createTaskDto);

    // Assign user or team
    if (createTaskDto.user) {
      task.user = new Types.ObjectId(createTaskDto.user);
    }

    if (createTaskDto.team) {
      task.team = new Types.ObjectId(createTaskDto.team);
    }

    // Assign default values if missing
    if (!createTaskDto.timelineWeeks) {
      task.timelineWeeks = 1; // Default timeline to 1 week
    }

    if (!createTaskDto.deadline) {
      task.deadline = new Date();
      task.deadline.setDate(task.deadline.getDate() + ((task.timelineWeeks ?? 1) * 7)); // Auto-set deadline
    }

    if (!createTaskDto.tags || createTaskDto.tags.length === 0) {
      task.tags = ['general']; // Default tag
    }

    return task.save();
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);

    task.user = new Types.ObjectId(createTaskDto.user); // Ensure correct user ID assignment

    if (!createTaskDto.timelineWeeks) {
      task.timelineWeeks = 1; // Default to 1 week
    }

    if (!task.deadline) {
      task.deadline = new Date();
    }

    task.deadline.setDate(task.deadline.getDate() + (task.timelineWeeks ?? 1) * 7); // Ensure deadline calculation

    if (!createTaskDto.tags || createTaskDto.tags.length === 0) {
      task.tags = ['general']; // Default tag assignment
    }

    return task.save();
  }

  // Fetch tasks for a specific user
  async getUserTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ user: new Types.ObjectId(userId) }).exec();
    return tasks;
  }

  // Fetch tasks for a specific team
 async getTeamTasks(teamId: string): Promise<Task[]> {
    console.log("Received teamId:", teamId); // Debug log
    const tasks = await this.taskModel.find({ team: new Types.ObjectId(teamId) }).exec();
    console.log("Fetched Tasks for team:", tasks); // Debug log
    return tasks;
  }

  async getTasksByOwner(ownerId: string): Promise<Task[]> {
    return this.taskModel.find({ $or: [{ user: ownerId }, { team: ownerId }] }).exec();
  }

  async findAll(): Promise<Task[]>{
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findOneByTitle(title: string): Promise<Task> {
    const task = await this.taskModel.findOne({ title }).exec();
    if (!task) {
      throw new NotFoundException(`Task with title "${title}" not found`);
    }
    return task;
  }

  // Update task properties
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
    
  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getTasksSortedByPriority(order: 'asc' | 'desc' = 'desc'): Promise<Task[]> {
    return this.taskModel.find().sort({ priority: order === 'asc' ? 1 : -1 }).exec();
  }

  async getTasksByPriority(priority: 'low' | 'medium' | 'high'): Promise<Task[]> {
    return this.taskModel.find({ priority }).exec();
  }

  async getTasksByPrioritySorted(priority: 'low' | 'medium' | 'high', order: 'asc' | 'desc' = 'asc'): Promise<Task[]> {
    return this.taskModel
      .find({ priority }) // Filters tasks by priority
      .sort({ deadline: order === 'asc' ? 1 : -1 }) // Sorts by deadline (soonest first if 'asc')
      .exec();
  }

  async getTasksByPrioritySortedPaginated(
    priority: 'low' | 'medium' | 'high',
    order: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 10
  ): Promise<{ tasks: Task[], total: number, totalPages: number, currentPage: number }> {
    const total = await this.taskModel.countDocuments({ priority }); // Get total count

    const tasks = await this.taskModel
      .find({ priority })
      .sort({ deadline: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      tasks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async searchTasks(query: string, priority?: 'low' | 'medium' | 'high', page: number = 1, limit: number = 10): Promise<{ tasks: Task[], total: number, totalPages: number, currentPage: number }> {
    const searchCriteria: any = {};

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: `^.*${query}.*$`, $options: 'i' } }, // Match exact phrase in title
        { description: { $regex: `^.*${query}.*$`, $options: 'i' } } // Match exact phrase in description
      ];
    }

    if (priority) {
      searchCriteria.priority = priority;
    }

    const total = await this.taskModel.countDocuments(searchCriteria);
    const tasks = await this.taskModel
      .find(searchCriteria)
      .sort({ deadline: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      tasks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getTasksByTag(tag: string): Promise<Task[]> {
    return this.taskModel.find({ tags: tag }).exec();
  }

}
