import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventModule } from './event/event.module';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
