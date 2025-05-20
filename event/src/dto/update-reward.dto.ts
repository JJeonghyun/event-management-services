import { RewardDetailsDto } from './create-reward.dto';

export class UpdateRewardDto {
  name?: string;
  description?: string;
  details?: RewardDetailsDto[];
  eventId?: string;
}
