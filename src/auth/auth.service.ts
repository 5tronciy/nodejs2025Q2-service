import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoggingService } from '../logging/logging.service';
import { UserResponse } from '../types/interfaces';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    try {
      await this.loggingService.debug(
        `Attempting signup for login: ${signupDto.login}`,
        'AuthService',
      );

      const existingUser = await this.userRepository.findOne({
        where: { login: signupDto.login },
      });

      if (existingUser) {
        throw new ConflictException('User with this login already exists');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

      const now = Date.now();
      const user = this.userRepository.create({
        login: signupDto.login,
        password: hashedPassword,
        version: 1,
        createdAt: now,
        updatedAt: now,
      });

      await this.userRepository.save(user);

      await this.loggingService.info(
        `User successfully registered: ${signupDto.login}`,
        'AuthService',
        { userId: user.id },
      );

      return { message: 'User registered successfully' };
    } catch (error) {
      await this.loggingService.error(
        `Signup failed: ${error.message}`,
        error.stack,
        'AuthService',
        { login: signupDto.login },
      );
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    try {
      await this.loggingService.debug(
        `Login attempt for: ${loginDto.login}`,
        'AuthService',
      );

      const user = await this.userRepository.findOne({
        where: { login: loginDto.login },
      });

      if (!user) {
        throw new ForbiddenException('Authentication failed');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new ForbiddenException('Authentication failed');
      }

      const tokens = await this.generateTokens(user);

      await this.loggingService.info(
        `User successfully logged in: ${loginDto.login}`,
        'AuthService',
        { userId: user.id },
      );

      return tokens;
    } catch (error) {
      await this.loggingService.error(
        `Login failed: ${error.message}`,
        error.stack,
        'AuthService',
        { login: loginDto.login },
      );
      throw error;
    }
  }

  async refresh(refreshDto: RefreshDto): Promise<AuthTokens> {
    try {
      await this.loggingService.debug('Refresh token request', 'AuthService');

      const refreshTokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: refreshDto.refreshToken, isRevoked: false },
        relations: ['user'],
      });

      if (!refreshTokenRecord) {
        throw new ForbiddenException('Invalid refresh token');
      }

      if (refreshTokenRecord.expiresAt < new Date()) {
        refreshTokenRecord.isRevoked = true;
        await this.refreshTokenRepository.save(refreshTokenRecord);
        throw new ForbiddenException('Refresh token expired');
      }

      refreshTokenRecord.isRevoked = true;
      await this.refreshTokenRepository.save(refreshTokenRecord);

      const tokens = await this.generateTokens(refreshTokenRecord.user);

      await this.loggingService.info(
        `Tokens refreshed for user: ${refreshTokenRecord.user.login}`,
        'AuthService',
        { userId: refreshTokenRecord.user.id },
      );

      return tokens;
    } catch (error) {
      await this.loggingService.error(
        `Token refresh failed: ${error.message}`,
        error.stack,
        'AuthService',
      );
      throw error;
    }
  }

  async validateUser(payload: JwtPayload): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.excludePassword(user);
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenPayload = { ...payload, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const refreshTokenRecord = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await this.refreshTokenRepository.save(refreshTokenRecord);

    return {
      accessToken,
      refreshToken,
    };
  }

  private excludePassword(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
