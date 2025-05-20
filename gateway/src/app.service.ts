import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  private eventClient: ClientProxy;

  constructor() {
    this.eventClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'event', port: 4002 },
    });
  }

  getEvents() {
    return this.eventClient.send({ cmd: 'get-events' }, {});
  }

  createEvent(data: any) {
    return this.eventClient.send({ cmd: 'create-event' }, data);
  }
}
