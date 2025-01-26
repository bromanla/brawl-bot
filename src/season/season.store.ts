import type { Season } from './season.type.ts';
import type { StoreService } from '../store/store.service.js';

export class SeasonStore {
  private store: StoreService;

  constructor(store: StoreService) {
    this.store = store;

    this.store.exec(`
      CREATE TABLE IF NOT EXISTS seasons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt INTEGER NOT NULL
      );
    `);
  }

  public getLastCreated() {
    return this.store
      .prepare('SELECT * FROM seasons ORDER BY createdAt DESC LIMIT 1')
      .get() as Season | undefined;
  }

  public create() {
    return this.store
      .prepare('INSERT INTO seasons (createdAt) VALUES (?)')
      .run(Date.now());
  }
}
