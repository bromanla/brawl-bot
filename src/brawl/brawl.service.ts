import { clanMembersSchema } from './brawl.entity.ts';
import { config } from '../common/config.ts';

export class BrawlService {
  private readonly clanTag: string;
  private readonly headers = new Headers();
  private readonly prefixUrl = 'https://api.brawlstars.com/v1';

  constructor() {
    const { clanTag, token } = config.brawl;

    this.clanTag = clanTag.includes('#')
      ? clanTag.replace('#', '%23')
      : `%23${clanTag}`;

    this.headers.append('Authorization', `Bearer ${token}`);
  }

  public async getClanMembers(tag = this.clanTag) {
    const url = this.prefixUrl + `/clubs/${tag}/members`;
    const response = await fetch(url, { headers: this.headers });
    const data = await response.json();

    return clanMembersSchema.parse(data).items;
  }
}
