import 'dotenv/config';
import { cleanEnv, str, num } from 'envalid';

export class ConfigService {
  public readonly isDev: boolean;

  public readonly brawl: {
    token: string;
    clanTag: string;
  };

  public readonly vk: {
    token: string;
    conversationId: number;
    admins: number[];
  };

  constructor() {
    const config = cleanEnv(process.env, {
      NODE_ENV: str({ choices: ['development', 'production'] }),
      VK_TOKEN: str(),
      VK_CONVERSATION_ID: num(),
      VK_ADMIN: str(),
      BRAWL_CLAN_TAG: str(),
      BRAWL_TOKEN: str(),
    });

    this.isDev = config.isDev;
    this.brawl = {
      token: config.BRAWL_TOKEN,
      clanTag: config.BRAWL_CLAN_TAG,
    };
    this.vk = {
      token: config.VK_TOKEN,
      conversationId: config.VK_CONVERSATION_ID,
      admins: config.VK_ADMIN.split(',').map(Number),
    };
  }
}
