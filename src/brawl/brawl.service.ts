import type { ClanMemberReq } from './brawl.type.js';

export class BrawlService {
  private readonly clanTag: string;
  private readonly headers = new Headers();
  private readonly prefixUrl = 'https://api.brawlstars.com/v1';

  constructor(token: string, clanTag: string) {
    this.clanTag = clanTag.includes('#')
      ? clanTag.replace('#', '%23')
      : `%23${clanTag}`;

    this.headers.append('Authorization', `Bearer ${token}`);
  }

  public async getClanMembers(
    tag = this.clanTag,
  ): Promise<ClanMemberReq['items']> {
    const url = this.prefixUrl + `/clubs/${tag}/members`;

    const response = await fetch(url, { headers: this.headers });
    const data = await response.json();

    return data.items;
  }
}
