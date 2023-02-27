import { Between, MoreThan } from 'typeorm';
import { endOfDay, startOfDay } from 'date-fns';
import type { Repository } from 'typeorm';
import type { Player } from './player.entity.js';
import type { BrawlService } from '#src/brawl/brawl.service.js';
import type { SeasonService } from '#src/season/index.js';

export class PlayerService {
  constructor(
    private readonly playerRepository: Repository<Player>,
    private readonly brawlService: BrawlService,
    private readonly seasonService: SeasonService,
  ) {}

  /* Получить последнюю запись в базе */
  public async findLastCreatedDate() {
    const [player] = await this.playerRepository.find({
      select: { createdDate: true },
      order: { id: 'desc' },
      take: 1,
    });

    return player?.createdDate;
  }

  /* Получить записи между двумя датами */
  private findByBetweenCreatedDate(start: Date, end: Date) {
    return this.playerRepository.find({
      where: {
        createdDate: Between(start, end),
      },
    });
  }

  /* Записи зафиксированные в последний запуск */
  public async getPlayersOnLastCreatedDate() {
    const lastDate = await this.findLastCreatedDate();

    return lastDate
      ? await this.findByBetweenCreatedDate(
          startOfDay(lastDate),
          endOfDay(lastDate),
        )
      : [];
  }

  /**
   * Первые (или больше даты из параметра)
   * зафиксированные записи для игроков,
   * находящихся в клане, на текущий момент
   */
  public async getPlayersOnFirstCreatedDate(start?: Date) {
    const players = await this.brawlService.getClanMembers();

    return Promise.all(
      players.map(async ({ tag }) => {
        const [cache] = await this.playerRepository.find({
          take: 1,
          order: { id: 'asc' },
          where: { tag, createdDate: start ? MoreThan(start) : undefined },
        });

        return cache;
      }),
    );
  }

  /* Создать новые записи относительно playersCache */
  public async getStats(playersCache: Player[]) {
    const clanMembers = await this.brawlService.getClanMembers();

    return clanMembers.map((player) => {
      const cache = playersCache.find((el) => el.tag === player.tag);
      const difference = cache ? player.trophies - cache.trophies : 0;

      return this.playerRepository.create({
        name: player.name,
        tag: player.tag,
        trophies: player.trophies,
        difference,
      });
    });
  }

  /* Получить отображение изменения статистики */
  public getStatsMessage(header: string, players: Player[]) {
    return players
      .filter(({ difference }) => difference !== 0)
      .sort((a, b) => b.difference - a.difference)
      .reduce(
        (acc, { name, difference }, index) =>
          acc + `${index + 1}. ${name} ${difference}\n`,
        header,
      );
  }

  public insert(players: Player[]) {
    return this.playerRepository.insert(players);
  }

  public async getRecordMessage(message: string, sort: 'max' | 'min') {
    const startSeason = await this.seasonService.getStartSeasonDate();

    const [player] = await this.playerRepository.find({
      order: { difference: sort === 'max' ? 'desc' : 'asc' },
      take: 1,
      where: {
        createdDate: MoreThan(startSeason),
      },
    });

    return player ? `${message} ${player.name} ${player.difference}` : '';
  }
}
