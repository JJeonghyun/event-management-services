import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './app.service';

@Controller()
export class EventController {
  constructor(private eventService: EventService) {}

  @MessagePattern({ cmd: 'create-event' })
  async createEvent(data: any) {
    return this.eventService.create(data);
  }

  @MessagePattern({ cmd: 'get-events' })
  async getEvents() {
    return this.eventService.findAll();
  }

  @MessagePattern({ cmd: 'get-event-by-id' })
  async getEventById(data: { id: string }) {
    return this.eventService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'remove-event' })
  async removeEvent(data: { id: string }) {
    return this.eventService.remove(data.id);
  }

  @MessagePattern({ cmd: 'create-reward' })
  async createReward(data: any) {
    return this.eventService.createReward(data);
  }

  @MessagePattern({ cmd: 'get-rewards' })
  async getRewards(query: any) {
    return this.eventService.getRewards(query);
  }

  @MessagePattern({ cmd: 'get-reward-by-id' })
  async getRewardById(data: { id: string }) {
    return this.eventService.getRewardById(data.id);
  }

  @MessagePattern({ cmd: 'update-reward' })
  async updateReward(data: { id: string; updateData: any }) {
    return this.eventService.updateReward(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'remove-reward' })
  async removeReward(data: { id: string }) {
    return this.eventService.removeReward(data.id);
  }

  @MessagePattern({ cmd: 'add-reward-item' })
  async addRewardItem(data: { rewardId: string; data: any }) {
    return this.eventService.addRewardItem(data.rewardId, data.data);
  }

  @MessagePattern({ cmd: 'remove-reward-item' })
  async removeRewardItem(data: { rewardId: string; itemId: string }) {
    return this.eventService.removeRewardItem(data.rewardId, data.itemId);
  }

  @MessagePattern({ cmd: 'update-reward-item' })
  async updateRewardItem(data: {
    rewardId: string;
    itemId: string;
    updateData: any;
  }) {
    return this.eventService.updateRewardItem(
      data.rewardId,
      data.itemId,
      data.updateData,
    );
  }

  @MessagePattern({ cmd: 'get-reward-history-by-user' })
  async getRewardHistoryByUser(data: { userId: string; eventId: string }) {
    return this.eventService.getRewardHistoryByUser(data.userId, data.eventId);
  }

  @MessagePattern({ cmd: 'request-reward' })
  async requestReward(data: {
    userId: string;
    eventId: string;
    rewardId: string;
    info: { isFirstLogin: boolean; isReferral: boolean };
  }) {
    return this.eventService.requestReward(
      data.userId,
      data.eventId,
      data.rewardId,
      data.info,
    );
  }

  @MessagePattern({ cmd: 'get-reward-requests' })
  async getRewardRequests(query: any) {
    return this.eventService.getRewardRequests(query);
  }
}
