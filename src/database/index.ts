import 'reflect-metadata';
import { Player } from '#src/player/index.js';
import { Season } from '#src/season/index.js';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'brawl.sqlite',
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  entities: [Player, Season],
});

export const playerRepository = dataSource.getRepository(Player);
export const seasonRepository = dataSource.getRepository(Season);
