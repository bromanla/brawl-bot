import type { Player } from './player.type.ts';
import type { StoreService } from '../store/store.service.ts';

export class PlayerStore {
  private store: StoreService;

  constructor(store: StoreService) {
    this.store = store;

    this.store.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tag TEXT NOT NULL,
        trophies INTEGER NOT NULL,
        difference INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
  }

  public create(player: Omit<Player, 'id' | 'createdAt'>) {
    const query = this.store.prepare(`
      INSERT INTO players (name, tag, trophies, difference, createdAt)
      VALUES (?, ?, ?, ?, ?);
    `);

    return query.run(
      player.name,
      player.tag,
      player.trophies,
      player.difference,
      Date.now(),
    );
  }

  public getLastCreated() {
    return this.store
      .prepare('SELECT * FROM players ORDER BY createdAt DESC LIMIT 1')
      .get() as Player | undefined;
  }

  public getLastCreatedByTag(tag: string) {
    return this.store
      .prepare(
        'SELECT * FROM players WHERE tag = ? ORDER BY createdAt DESC LIMIT 1',
      )
      .get(tag) as Player | undefined;
  }

  public getTopByDifference(createdAfter: number, order: 'DESC' | 'ASC') {
    return this.store
      .prepare(
        `SELECT * FROM players WHERE createdAt > ? ORDER BY difference ${order} LIMIT 1`,
      )
      .get(createdAfter) as Player | undefined;
  }

  public getFirstCreatedByTag(tag: string, createdAfter: number) {
    return this.store
      .prepare(
        'SELECT * FROM players WHERE tag = ? AND createdAt > ? ORDER BY createdAt ASC LIMIT 1',
      )
      .get(tag, createdAfter) as Player | undefined;
  }
}
