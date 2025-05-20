import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './app.controller';
import { EventService } from './app.service';
import {
  Event,
  EventSchema,
  Reward,
  RewardSchema,
  RewardRequest,
  RewardRequestSchema,
} from './schema/event.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {}
