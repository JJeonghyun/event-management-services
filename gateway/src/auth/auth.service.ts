import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private authClient: ClientProxy;
  constructor(private jwtService: JwtService) {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'auth', port: 4001 },
    });
  }

  async register(
    username: string,
    password: string,
    roles?: string[],
    referralCode?: string,
  ) {
    return this.authClient
      .send({ cmd: 'register' }, { username, password, roles, referralCode })
      .toPromise();
  }

  async login(username: string, password: string) {
    const user = await this.authClient
      .send({ cmd: 'login' }, { username, password })
      .toPromise();
    if (!user) throw new Error('Invalid credentials');

    await this.authClient
      .send({ cmd: 'is-first-login' }, { userId: user.id })
      .toPromise();

    const payload = {
      userId: user.id,
      username: user.username,
      roles: user.roles,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
