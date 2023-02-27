import { got } from 'got';
import type { Got } from 'got';
import type { ClanMemberReq } from './brawl.type.js';

export class BrawlService {
  private readonly clanTag: string;
  private readonly client: Got;

  constructor(token: string, clanTag: string) {
    this.clanTag = clanTag.includes('#')
      ? clanTag.replace('#', '%23')
      : `%23${clanTag}`;

    this.client = got.extend({
      prefixUrl: 'https://api.brawlstars.com/v1/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async getClanMembers(tag = this.clanTag) {
    const { items } = await this.client
      .get(`clubs/${tag}/members`)
      .json<ClanMemberReq>();

    return items;
  }
}
