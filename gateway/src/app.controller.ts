import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { EventService } from './event/event.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventService: EventService,
  ) {}

  // 회원가입
  @Post('auth/register')
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      roles?: string[];
      referralCode?: string;
    },
  ) {
    return this.authService.register(
      body.username,
      body.password,
      body.roles,
      body.referralCode,
    );
  }

  // 로그인
  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  // 이벤트 등록 (OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('events')
  async createEvent(@Body() body, @Request() req) {
    return this.eventService.createEvent(body);
  }

  // 전체 이벤트 조회 (USER 이상)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('events')
  async getEvents(@Request() req) {
    return this.eventService.getEvents();
  }

  // 이벤트 상세 조회 (USER 이상)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('events/:id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  // 이벤트 삭제(OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Delete('events/:id')
  async removeEvent(@Param('id') id: string) {
    return this.eventService.removeEvent(id);
  }

  // 보상 등록 (OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('rewards')
  async createReward(@Body() body, @Request() req) {
    return this.eventService.createReward(body);
  }

  // 보상 목록 조회 (USER 이상)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('rewards')
  async getRewards(@Request() req) {
    return this.eventService.getRewards(req.user.userId);
  }

  // 보상 상세 조회 (USER 이상)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('rewards/:id')
  async getRewardById(@Param('id') id: string) {
    return this.eventService.getRewardById(id);
  }

  // 보상 수정 (OPERATOR, ADMIN)
  // 보상 정보를 수정
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Patch('rewards/:id')
  async updateReward(@Param('id') id: string, @Body() body) {
    return this.eventService.updateReward(id, body);
  }

  // 보상 삭제 (OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Patch('rewards/:id/delete')
  async deleteReward(@Param('id') id: string) {
    return this.eventService.deleteReward(id);
  }

  // 보상 항목 추가 (OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('rewards/:id/items')
  async addRewardItem(@Param('id') id: string, @Body() body) {
    return this.eventService.addRewardItem(id, body);
  }

  // 보상 항목 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Patch('rewards/:id/items/:itemId/delete')
  async removeRewardItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.eventService.removeRewardItem(id, itemId);
  }

  // 보상 항목 수정 (OPERATOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Patch('rewards/:id/items/:itemId')
  async updateRewardItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body,
  ) {
    return this.eventService.updateRewardItem(id, itemId, body);
  }

  // 유저 보상 요청 (USER, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Post('rewards/request')
  async requestReward(@Body() body, @Request() req) {
    return this.eventService.requestReward(
      req.user.userId,
      body.eventId,
      body.rewardId,
    );
  }

  // 보상 요청 내역 조회 (본인: USER, 전체: OPERATOR, AUDITOR, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('rewards/requests/history')
  async getRewardRequests(@Request() req) {
    // 유저는 본인만 조회, 그 외는 전체 조회
    if (req.user.roles.includes('USER')) {
      return this.eventService.getRewardRequests({ userId: req.user.userId });
    }
    return this.eventService.getRewardRequests({});
  }
}
