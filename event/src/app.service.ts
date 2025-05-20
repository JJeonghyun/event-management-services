import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Event,
  EventDocument,
  Reward,
  RewardRequest,
} from './schema/event.schema';

import { CreateEventDto } from './dto/create-event.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequest>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const isEvent = await this.eventModel.findOne({
      title: createEventDto.title,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
    });
    if (isEvent) throw new ConflictException('Event already exists');

    return this.eventModel.create({
      ...createEventDto,
      status: createEventDto.status.toUpperCase(),
    });
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  // async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
  //   const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
  //   if (!event) throw new NotFoundException('Event not found');
  //   return event;
  // }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    if (!result.deletedCount) throw new NotFoundException('Event not found');
  }

  // 보상 등록
  async createReward(createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardModel.create({
      ...createRewardDto,
      eventId: new Types.ObjectId(createRewardDto.eventId),
    });
  }

  // 보상 목록 조회
  async getRewards(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find().populate('eventId').lean();
  }

  // 보상 상세 조회
  async getRewardById(rewardId: string): Promise<Reward> {
    const reward = await this.rewardModel
      .findById(rewardId)
      .populate('eventId')
      .lean();
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  // 보상 수정
  async updateReward(
    id: string,
    updateRewardDto: UpdateRewardDto,
  ): Promise<Reward> {
    if (updateRewardDto.eventId) {
      updateRewardDto.eventId = new Types.ObjectId(
        updateRewardDto.eventId,
      ) as any;
    }
    const reward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .populate('eventId')
      .exec();
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  // 보상 삭제
  async removeReward(id: string): Promise<void> {
    const result = await this.rewardModel.deleteOne({ _id: id }).exec();
    if (!result.deletedCount) throw new NotFoundException('Reward not found');
  }

  // 보상 항목 추가 (기존 보상에 추가적으로 항목 추가)
  async addRewardItem(
    rewardId: string,
    data: { type: string; quantity: number },
  ): Promise<Reward> {
    const reward = await this.rewardModel.findById(rewardId).exec();
    if (!reward) throw new NotFoundException('Reward not found');

    reward.rewards.push(data);
    await reward.save();
    return reward;
  }

  // 보상 항목 삭제 (기존에 등록된 보상에서 특정 항목 삭제)
  async removeRewardItem(
    rewardId: string,
    rewardType: string,
  ): Promise<Reward> {
    const reward = await this.rewardModel.findById(rewardId).exec();
    if (!reward) throw new NotFoundException('Reward not found');

    reward.rewards = reward.rewards.filter((item) => item.type !== rewardType);
    await reward.save();
    return reward;
  }

  // 보상 항목 수정 (기존 보상 항목 수정)
  async updateRewardItem(
    rewardId: string,
    rewardType: string,
    item: { type: string; quantity: number },
  ): Promise<Reward> {
    const reward = await this.rewardModel.findById(rewardId).exec();
    if (!reward) throw new NotFoundException('Reward not found');

    const itemIndex = reward.rewards.findIndex(
      (item) => item.type === rewardType,
    );
    if (itemIndex === -1) throw new NotFoundException('Reward item not found');

    reward.rewards[itemIndex] = item;
    await reward.save();
    return reward;
  }

  // 유저 보상 요청 내역 조회
  async getRewardHistoryByUser(userId: string, eventId: string) {
    return await this.rewardRequestModel
      .findOne({ userId, eventId })
      .populate('eventId rewardId');
  }

  // 유저 보상 요청
  async requestReward(
    userId: string,
    eventId: string,
    rewardId: string,
    info: { isFirstLogin: boolean; isReferral: boolean },
  ) {
    const isEvent = await this.eventModel.findById(eventId);

    let reason: string = '';
    let status: boolean = true;

    if (!isEvent) throw new NotFoundException('Event not found');

    if (isEvent.status !== 'ACTIVE') {
      reason = '헤당 이벤트는 비활성화 상태입니다.';
      status = false;
    }

    if (isEvent.startDate > new Date()) {
      reason = '해당 이벤트는 시작되지 않았습니다.';
      status = false;
    }

    if (isEvent.endDate < new Date()) {
      reason = '해당 이벤트는 종료되었습니다.';
      status = false;
    }

    if (
      (isEvent.condition === 'FIRST_LOGIN' && !info.isFirstLogin) ||
      (isEvent.condition === 'REFERRAL' && !info.isReferral)
    ) {
      reason = '이벤트 조건에 맞지 않습니다';
      status = false;
    }

    return this.rewardRequestModel.create({
      userId,
      eventId,
      rewardId,
      reason,
      status,
    });
  }

  // 요청 내역 (유저별/전체)
  async getRewardRequests(query: any) {
    return this.rewardRequestModel
      .find(query)
      .populate('eventId rewardId')
      .lean();
  }
}
