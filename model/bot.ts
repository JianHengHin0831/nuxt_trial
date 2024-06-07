import { z } from 'zod';

export const BotStatus = z.enum([
  'Idle',
  'Working',
]);
  
export const Bot = z.object({
  id: z.number(),
  status: BotStatus,
  order: z.number().nullish(),
  time: z.number().nullish()
})

declare global {
  type BotStatus = z.infer<typeof BotStatus>;
  type Bot = z.infer<typeof Bot>;
}

// nullish - value | undefined | null
// optinal - value | undefined
