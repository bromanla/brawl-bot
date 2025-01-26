import type { z } from 'zod';
import type { clanMemberSchema } from './brawl.entity.ts';

export type ClanMembers = z.infer<typeof clanMemberSchema>;
