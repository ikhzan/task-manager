import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team, TeamDocument } from './schemas/team.schema';
import { UpdateTeamMembersDto } from './dto/update-team.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class TeamService {
    constructor(
        @InjectModel(Team.name) private teamModel: Model<TeamDocument>, 
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    // Create a new team
    async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
        // Check if all users exist
        const usersExist = await this.userModel.find({ _id: { $in: createTeamDto.members } });

        if (usersExist.length !== createTeamDto.members.length) {
            throw new Error("One or more users do not exist.");
        }

        // Create the team
        const team = new this.teamModel(createTeamDto);
        return team.save();
    }

    // Get all teams
    async getAllTeams(): Promise<Team[]> {
        return this.teamModel.find().exec();
    }

    // Get a single team by ID
    async getTeamById(teamId: string): Promise<Team | null> {
        return this.teamModel.findById(teamId).populate('members').populate('tasks').exec();
    }

    // Update team members
    async updateTeamMembers(teamId: string, updateTeamMembersDto: UpdateTeamMembersDto): Promise<Team | null> {
        return this.teamModel.findByIdAndUpdate(teamId, { members: updateTeamMembersDto.members }, { new: true }).exec();
    }

    // Assign a task to a team
    async assignTaskToTeam(teamId: string, taskId: string): Promise<Team | null> {
        return this.teamModel.findByIdAndUpdate(teamId, { $push: { tasks: new Types.ObjectId(taskId) } }, { new: true }).exec();
    }

    async addUserToTeam(teamId: string, userId: string): Promise<Team | null> {
        return this.teamModel.findByIdAndUpdate(
            teamId,
            { $push: { members: new Types.ObjectId(userId) } },
            { new: true }
        ).exec();
    }

    async setUserRole(teamId: string, userId: string, role: 'admin' | 'member'): Promise<Team | null> {
        const team = await this.teamModel.findById(teamId);
        if (!team) throw new Error("Team not found.");

        if (role === 'admin') {
            // ✅ Promote user to admin
            await this.teamModel.findByIdAndUpdate(teamId, { $addToSet: { admins: userId } }); // Prevent duplicate admins
        } else if (role === 'member') {
            // ✅ Remove user from admin list if downgraded
            await this.teamModel.findByIdAndUpdate(teamId, { $pull: { admins: userId } });
        }

        return this.teamModel.findById(teamId).exec(); // Return updated team
    }

}
