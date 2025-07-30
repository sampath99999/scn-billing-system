import { z } from 'zod';

export const createAccessorySchema = z.object({
    name: z
        .string({ message: 'Accessory Name is required' })
        .min(1, 'Accessory Name is required')
        .max(50, 'Accessory Name must be less than 50 characters'),
    cost: z
        .number({ message: 'Cost is required' })
        .min(0, 'Cost must be greater than or equal to 0')
        .max(10000, 'Cost must be less than or equal to 10000')
        .int('Cost must be an integer'),
});

export type CreateAccessoryData = z.infer<typeof createAccessorySchema>;
