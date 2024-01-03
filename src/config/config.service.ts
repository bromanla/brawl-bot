import { cleanEnv, str, num } from 'envalid';

export class ConfigService {
  public readonly isDev: boolean;

  public readonly brawl: {
    token: string;
    clanTag: string;
    recordLabel: string;
    antiRecordLabel: string;
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
      BRAWL_RECORD: str({ default: 'Рекорд:' }),
      BRAWL_ANTIRECORD: str({ default: 'Антирекорд:' }),
    });

    this.isDev = config.isDev;
    this.brawl = {
      token: config.BRAWL_TOKEN,
      clanTag: config.BRAWL_CLAN_TAG,
      recordLabel: config.BRAWL_RECORD,
      antiRecordLabel: config.BRAWL_ANTIRECORD,
    };
    this.vk = {
      token: config.VK_TOKEN,
      conversationId: config.VK_CONVERSATION_ID,
      admins: config.VK_ADMIN.split(',').map(Number),
    };
  }
}
