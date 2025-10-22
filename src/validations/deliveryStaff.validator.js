import { z } from 'zod';
export const deliveryStaffUpdate = z
  .object({
    name: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
      .optional(),
    phone: z
      .string()
      .regex(/^\+\d{10,15}$/, 'Invalid phone number')
      .optional(),
    vehicle_number: z
      .string()
      .min(3, 'Vehicle Number Too short')
      .max(10, 'Vehicle Number Too long')
      .trim()
      .optional(),
  })
  .strict();

export const deliveryStaffValidate = z
  .object({
    name: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
    phone: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
    vehicle_number: z
      .string()
      .min(3, 'Vehicle Number Too short')
      .max(10, 'Vehicle Number Too long')
      .trim(),
  })
  .strict();
