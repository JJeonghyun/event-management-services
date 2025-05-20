export class RewardDetailsDto {
  type: string;
  quantity: number;
}

export class CreateRewardDto {
  name: string;
  description?: string;
  rewards: RewardDetailsDto[];
  eventId: string;
}
