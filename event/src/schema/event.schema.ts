import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type RewardDocument = Reward & Document;

export class RewardItem {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [RewardItem], required: true })
  rewards: RewardItem[];

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

@Schema()
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: string;

  @Prop({ type: Types.ObjectId, ref: 'Reward', required: true })
  rewardId: string;

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
