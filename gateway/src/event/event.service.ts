import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class EventService {
  private eventClient: ClientProxy;
  private authClient: ClientProxy;
  constructor() {
    this.eventClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'event', port: 4002 },
    });
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'auth', port: 4001 },
    });
  }

  createEvent(data: any) {
    return this.eventClient.send({ cmd: 'create-event' }, data).toPromise();
  }

  getEvents() {
    return this.eventClient.send({ cmd: 'get-events' }, {}).toPromise();
  }

  getEventById(id: string) {
    return this.eventClient
      .send({ cmd: 'get-event-by-id' }, { id })
      .toPromise();
  }

  removeEvent(id: string) {
    return this.eventClient.send({ cmd: 'remove-event' }, { id }).toPromise();
  }

  createReward(data: any) {
    return this.eventClient.send({ cmd: 'create-reward' }, data).toPromise();
  }

  getRewards(query: any) {
    return this.eventClient.send({ cmd: 'get-rewards' }, query).toPromise();
  }

  getRewardById(id: string) {
    return this.eventClient
      .send({ cmd: 'get-reward-by-id' }, { id })
      .toPromise();
  }

  updateReward(id: string, data: any) {
    return this.eventClient
      .send({ cmd: 'update-reward' }, { id, data })
      .toPromise();
  }

  deleteReward(id: string) {
    return this.eventClient.send({ cmd: 'delete-reward' }, { id }).toPromise();
  }

  addRewardItem(rewardId: string, data: any) {
    return this.eventClient
      .send({ cmd: 'add-reward-item' }, { rewardId, data })
      .toPromise();
  }

  removeRewardItem(rewardId: string, itemId: string) {
    return this.eventClient
      .send({ cmd: 'remove-reward-item' }, { rewardId, itemId })
      .toPromise();
  }

  updateRewardItem(rewardId: string, itemId: string, data: any) {
    return this.eventClient
      .send({ cmd: 'update-reward-item' }, { rewardId, itemId, data })
      .toPromise();
  }

  async requestReward(userId: string, eventId: string, rewardId: string) {
    const user = await this.authClient
      .send({ cmd: 'find-user-by-id' }, { userId })
      .toPromise();

    if (!user) {
      throw new Error('User not found');
    }

    // 보상 이력 확인
    const rewardHistory = await this.eventClient
      .send({ cmd: 'get-reward-history-by-user' }, { userId, eventId })
      .toPromise();

    if (rewardHistory) {
      throw new Error('Reward already requested');
    }
    return this.eventClient
      .send(
        { cmd: 'request-reward' },
        {
          userId,
          eventId,
          rewardId,
          info: {
            isFirstLogin: user.isFirstLogin,
            isReferral: user.isReferral,
          },
        },
      )
      .toPromise();
  }

  getRewardRequests(query: any) {
    return this.eventClient
      .send({ cmd: 'get-reward-requests' }, query)
      .toPromise();
  }
}
