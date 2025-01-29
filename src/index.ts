import { SeasonStore } from './season/season.store.ts';
import { BrawlService } from './brawl/brawl.service.ts';
import { StoreService } from './store/store.service.ts';
import { BotService } from './bot/bot.service.ts';
import { PlayerStore } from './player/player.store.ts';

import { PlayerService } from './player/player.service.ts';
import { OctopusService } from './octopus/octopus.service.ts';

const store = new StoreService();
const seasonStore = new SeasonStore(store);
const playerStore = new PlayerStore(store);

const brawlService = new BrawlService();
const botService = new BotService();
const playerService = new PlayerService(playerStore);

new OctopusService(
  brawlService,
  botService,
  playerService,
  playerStore,
  seasonStore,
);

botService.mount();
