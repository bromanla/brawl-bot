import Cron from 'croner';
import { BrawlService } from '#src/brawl/index.js';
import { ConfigService } from '#src/config/index.js';
import { PlayerService } from '#src/player/player.service.js';
import { VkService } from '#src/vk/index.js';
import { SeasonService } from '#src/season/index.js';
import {
  dataSource,
  playerRepository,
  seasonRepository,
} from '#src/database/index.js';

await dataSource.initialize();

// Инициализация сервисов
const config = new ConfigService();
const brawlService = new BrawlService(config.brawl.token, config.brawl.clanTag);
const seasonService = new SeasonService(seasonRepository);
const playerService = new PlayerService(
  playerRepository,
  brawlService,
  seasonService,
);
const vkService = new VkService(
  config.vk.token,
  config.vk.conversationId,
  config.vk.admins,
);

// Ежедневное обновление статистики по cron
Cron('@daily', async () => {
  const playersCache = await playerService.getPlayersOnLastCreatedDate();
  const players = await playerService.getStats(playersCache);
  const stats = playerService.getStatsMessage('Статистика за день:\n', players);

  await playerService.insert(players);

  const record = await playerService.getRecordMessage(
    config.brawl.recordLabel,
    'max',
  );
  const antiRecord = await playerService.getRecordMessage(
    config.brawl.antiRecordLabel,
    'min',
  );
  const message = [stats, record, antiRecord].join('\n');

  await vkService.sendMessage(message);
});

// Начать прослушивать сообщения из диалога
await vkService.mount();

// Событие обновления сезона
vkService.on('season', async () => {
  const startDate = await seasonService.getStartSeasonDate();
  const playersCache = await playerService.getPlayersOnFirstCreatedDate(
    startDate,
  );
  const players = await playerService.getStats(playersCache);
  const message = playerService.getStatsMessage(
    'Статистика за сезон\n',
    players,
  );

  // await seasonService.create();
  await vkService.sendMessage(message);
});

// Показать статистику за все время
vkService.on('origin', async () => {
  const playersCache = await playerService.getPlayersOnFirstCreatedDate();
  const players = await playerService.getStats(playersCache);
  const message = playerService.getStatsMessage(
    'Статистика за все время\n',
    players,
  );

  await vkService.sendMessage(message);
});
