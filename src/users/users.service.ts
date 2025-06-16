import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserResponse } from '../types/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      await this.loggingService.debug(
        `Creating new user with login: ${createUserDto.login}`,
        'UsersService',
      );
      const now = Date.now();
      const user = this.userRepository.create({
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      });

      const savedUser = await this.userRepository.save(user);
      return this.excludePassword(savedUser);
    } catch (error) {
      await this.loggingService.error(
        `Failed to create user: ${error.message}`,
        error.stack,
        'UsersService',
        { login: createUserDto.login },
      );
      throw error;
    }
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const updatedUser = await this.userRepository.save(user);
    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  private excludePassword(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
