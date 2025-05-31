import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Query } from '@nestjs/common';


@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    // Create a new task
    @Post()
    async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('user/:userId')
    getUserTasks(@Param('userId') userId: string) {
        return this.tasksService.getUserTasks(userId);
    }

    @Post('/team')
    createTaskForTeam(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createTaskForTeam(createTaskDto);
    }

    @Get('team/:teamId')
    getTeamTasks(@Param('teamId') teamId: string) {
        return this.tasksService.getTeamTasks(teamId);
    }

    @Get('owner/:ownerId')
    getTasksByOwner(@Param('ownerId') ownerId: string) {
        return this.tasksService.getTasksByOwner(ownerId);
    }

    // Get all tasks
    @Get()
    async findAll(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    // Get a specific task by ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Task> {
        return this.tasksService.findOne(id);
    }

    // Update a task by ID
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.tasksService.update(id, updateTaskDto);
    }

    // Delete a task by ID
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.tasksService.remove(id);
    }

    @Get('sorted/:order')
    getSortedTasks(@Param('order') order: 'asc' | 'desc') {
        return this.tasksService.getTasksSortedByPriority(order);
    }

    @Get('filter/:priority')
    getTasksByPriority(@Param('priority') priority: 'low' | 'medium' | 'high') {
        return this.tasksService.getTasksByPriority(priority);
    }

    @Get('filter/:priority/sort/:order')
    getTasksByPrioritySorted(@Param('priority') priority: 'low' | 'medium' | 'high', @Param('order') order: 'asc' | 'desc') {
        return this.tasksService.getTasksByPrioritySorted(priority, order);
    }

    @Get('filter/:priority/sort/:order/page/:page/limit/:limit')
    async getTasksByPrioritySortedPaginated(
        @Param('priority') priority: 'low' | 'medium' | 'high',
        @Param('order') order: 'asc' | 'desc',
        @Param('page') page: number,
        @Param('limit') limit: number
    ) {
        return this.tasksService.getTasksByPrioritySortedPaginated(priority, order, Number(page), Number(limit));
    }

    // search/flutter/page/1/limit/5, search title/
    @Get('search/:query/page/:page/limit/:limit')
    async searchTasks(
        @Param('query') query: string,
        @Param('page') page: number,
        @Param('limit') limit: number,
        @Query('priority') priority?: 'low' | 'medium' | 'high'
    ) {
        return this.tasksService.searchTasks(query, priority, Number(page), Number(limit));
    }

    @Get('tags/:tag')
    getTasksByTag(@Param('tag') tag: string) {
        return this.tasksService.getTasksByTag(tag);
    }

}
