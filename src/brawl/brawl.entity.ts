import { z } from 'zod';

export const clanMemberSchema = z.object({
  tag: z.string(),
  name: z.string(),
  nameColor: z.string(),
  role: z.string(),
  trophies: z.number(),
  icon: z.object({
    id: z.number(),
  }),
});

export const clanMembersSchema = z.object({
  items: z.array(clanMemberSchema),
});
