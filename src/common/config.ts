import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  VK_TOKEN: z.string().min(1),
  VK_CONVERSATION_ID: z.coerce.number(),
  VK_ADMIN: z.string().min(1),
  BRAWL_CLAN_TAG: z.string().min(1),
  BRAWL_TOKEN: z.string().min(1),
  BRAWL_RECORD_LABEL: z.string().default('Record:'),
  BRAWL_ANTIRECORD_LABEL: z.string().default('Antirecord:'),
});

const envConfig = envSchema.parse(process.env);

export const config = Object.freeze({
  isDev: envConfig.NODE_ENV === 'development',
  brawl: Object.freeze({
    token: envConfig.BRAWL_TOKEN,
    clanTag: envConfig.BRAWL_CLAN_TAG,
    recordLabel: envConfig.BRAWL_RECORD_LABEL,
    antiRecordLabel: envConfig.BRAWL_ANTIRECORD_LABEL,
  }),
  vk: Object.freeze({
    token: envConfig.VK_TOKEN,
    conversationId: envConfig.VK_CONVERSATION_ID,
    admins: Object.freeze(envConfig.VK_ADMIN.split(',').map(Number)),
  }),
});
