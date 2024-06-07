

import { z } from 'zod';

export const OrderType = z.enum([
  'Normal',
  'VIP',
]);


export const OrderStatus = z.enum([
  'Pending',
  'Processing',
  'Completed'
]);


export const Order = z.object({
  id: z.number(),
  type: OrderType,
  status: OrderStatus,
})


declare global {
  type OrderType = z.infer<typeof OrderType>;
  type OrderStatus = z.infer<typeof OrderStatus>;
  type Order = z.infer<typeof Order>;
}