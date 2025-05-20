import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './app.service';

@Controller()
export class AuthController {
  constructor(private usersService: UsersService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: {
    username: string;
    password: string;
    roles?: string[];
    referralCode?: string;
  }) {
    return this.usersService.createUser(
      data.username,
      data.password,
      data.roles,
      data.referralCode,
    );
  }

  @MessagePattern({ cmd: 'is-first-login' })
  async handleFirstLogin(data: { userId: string }) {
    this.usersService.handleFirstLogin(data.userId);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    const user = await this.usersService.validateUser(
      data.username,
      data.password,
    );
    if (!user) return null;
    return { id: user._id, username: user.username, roles: user.roles };
  }

  @MessagePattern({ cmd: 'find-user-by-id' })
  async findUser(data: { userId: string }) {
    return this.usersService.findById(data.userId);
  }
}
