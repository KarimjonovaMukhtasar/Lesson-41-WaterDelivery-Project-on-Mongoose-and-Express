import { z } from 'zod';
 const orderItemValidate = z
  .object({
    order_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID').optional(),
    product_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().positive('Must be greater than 0'),
    total_price: z
      .number()
      .positive('Must be greater than 0')
      .min(0.01)
      .optional(),
  });

 const orderValidate = z
  .object({
    delivery_staff_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid delivery staff ID'),
    order_date: z
      .date()
      .min(new Date('2020-01-01'), 'Too early')
      .max(new Date(), 'Cannot be in future')
      .optional(),
    status: z.enum(['pending', 'ordered', 'cancelled']).optional(),
  });

export const orderWithItemsValidate = z.object({
  order: orderValidate,
  order_items: z
    .array(orderItemValidate)
    .min(1, 'At least one product must be added'),
})

const orderUpdate = z
  .object({
    delivery_staff_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid delivery staff ID')
      .optional(),
    order_date: z
      .date()
      .min(new Date('2020-01-01'), 'Too early')
      .max(new Date(), 'Cannot be in future')
      .optional(),
    status: z.enum(['pending', 'ordered', 'cancelled']).optional(),
  })
  .strict();


const orderItemUpdate = z
    .object({
      order_id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID')
        .optional(),
      product_id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
        .optional(),
      quantity: z.number().positive('Must be greater than 0').optional(),
      total_price: z
        .number()
        .positive('Must be greater than 0')
        .min(0.01)
        .optional(),
    })
    .strict();

export const orderWithItemsUpdate = z.object({
  order: orderUpdate.partial(), 
  order_items: z.array(orderItemUpdate.partial()).optional()
})
