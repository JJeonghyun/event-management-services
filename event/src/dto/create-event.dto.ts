export class CreateEventDto {
  title: string;
  description?: string;
  condition: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
