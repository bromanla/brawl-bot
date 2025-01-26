import { Cron } from 'croner';
import { config } from '../common/config.ts';

import type { BrawlService } from '../brawl/brawl.service.ts';
import type { PlayerService } from '../player/player.service.ts';
import type { PlayerStore } from '../player/player.store.ts';
import type { SeasonStore } from '../season/season.store.ts';
import type { BotService } from '../bot/bot.service.ts';

export class OctopusService {
  private brawlService: BrawlService;
  private botService: BotService;
  private playerService: PlayerService;
  private playerStore: PlayerStore;
  private seasonStore: SeasonStore;

  constructor(
    brawlService: BrawlService,
    botService: BotService,
    playerService: PlayerService,
    playerStore: PlayerStore,
    seasonStore: SeasonStore,
  ) {
    this.brawlService = brawlService;
    this.botService = botService;
    this.playerService = playerService;
    this.playerStore = playerStore;
    this.seasonStore = seasonStore;

    new Cron('0 5 0 * * *', this.dailyTask.bind(this));

    this.botService.addCommand('season', this.seasonCommand.bind(this));
  }

  public async dailyTask() {
    const clanMembers = await this.brawlService.getClanMembers();
    const cachePlayers = clanMembers
      .map(({ tag }) => this.playerStore.getLastCreatedByTag(tag))
      .filter(Boolean);

    const players = this.playerService.handleStats(clanMembers, cachePlayers);
    // players.map(this.playerStore.create.bind(this.playerStore));

    const stats = this.playerService.getStatsMessage(
      'Statistics for the day:\n',
      players,
    );

    const season = this.seasonStore.getLastCreated();
    const startSeasonTime = season?.createdAt ?? 0;

    const maxRecord = this.playerService.getRecordMessage(
      startSeasonTime,
      config.brawl.recordLabel,
      'MAX',
    );
    const minRecord = this.playerService.getRecordMessage(
      startSeasonTime,
      config.brawl.antiRecordLabel,
      'MIN',
    );

    const message = [stats, maxRecord, minRecord].join('\n');

    console.log(message);
    // bot.sendMessage(message);
  }

  public async seasonCommand() {
    const clanMembers = await this.brawlService.getClanMembers();

    const season = this.seasonStore.getLastCreated();
    const startSeasonTime = season?.createdAt ?? 0;

    const cachePlayers = clanMembers
      .map(({ tag }) =>
        this.playerStore.getFirstCreatedByTag(tag, startSeasonTime),
      )
      .filter(Boolean);

    const players = this.playerService.handleStats(clanMembers, cachePlayers);

    const message = this.playerService.getStatsMessage(
      'Statistics for the season\n',
      players,
    );

    this.seasonStore.create();

    console.log(message);
    // bot.sendMessage(message);
  }
}
