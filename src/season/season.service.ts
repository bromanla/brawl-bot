import type { Season } from './season.entity';
import type { Repository } from 'typeorm';

export class SeasonService {
  constructor(private readonly seasonRepository: Repository<Season>) {}

  public async getStartSeasonDate() {
    const [season] = await this.seasonRepository.find({
      order: { id: 'desc' },
      take: 1,
    });

    return season?.createdDate;
  }

  public create() {
    const season = this.seasonRepository.create();
    return this.seasonRepository.save(season);
  }
}
