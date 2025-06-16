import { Controller, Get, Post, Put, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamMembersDto } from './dto/update-team.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.createTeam(createTeamDto);
  }

  @Get()
  getAllTeams() {
    return this.teamService.getAllTeams();
  }

  @Get(':teamId')
  getTeamById(@Param('teamId') teamId: string) {
    return this.teamService.getTeamById(teamId);
  }

  @Put(':teamId/members')
  updateTeamMembers(@Param('teamId') teamId: string, @Body() updateTeamMembersDto: UpdateTeamMembersDto) {
    return this.teamService.updateTeamMembers(teamId, updateTeamMembersDto);
  }

  @Put(':teamId/tasks/:taskId')
  assignTaskToTeam(@Param('teamId') teamId: string, @Param('taskId') taskId: string) {
    return this.teamService.assignTaskToTeam(teamId, taskId);
  }

  @Put(':teamId/users/:userId')
  addUserToTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
    return this.teamService.addUserToTeam(teamId, userId);
  }

  @Put(':teamId/users/:userId/role/:role')
  setUserRole(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Param('role') role: 'admin' | 'member'
  ) {
    return this.teamService.setUserRole(teamId, userId, role);
  }

  // Delete a team by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
      return this.teamService.remove(id);
  }
  

}