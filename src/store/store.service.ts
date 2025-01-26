import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

import type { SupportedValueType } from 'node:sqlite';

export class StoreService extends DatabaseSync {
  constructor() {
    const path = join(process.cwd(), 'data', 'store.db');
    super(path);
  }

  executeQuery<T>(
    query: string,
    ...params: SupportedValueType[]
  ): T | undefined {
    return this.prepare(query).get(...params) as T | undefined;
  }
}
