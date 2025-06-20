import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Team, TeamDocument } from 'src/teams/schemas/team.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(User.name) private teamModel: Model<TeamDocument>
  ) {}


  async getAllUsers(): Promise<User[]>{
    return this.userModel.find()
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return this.teamModel.find({ members: userId }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
    const existingEmail = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ fullName:createUserDto.fullName, username: createUserDto.username, password: hashedPassword, email: createUserDto.email });
    return newUser.save();
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username });
    return user === null ? undefined : user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
  

}
