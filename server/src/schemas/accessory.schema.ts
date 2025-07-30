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

export const accessoryQuerySchema = z.object({
    searchTerm: z.string().optional(),
    page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, { message: 'Page must be greater than 0' })
        .optional(),
    pageSize: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val <= 100, {
            message: 'Page size must be between 1 and 100',
        })
        .optional(),
    sortBy: z
        .enum(['name', 'cost', 'createdAt', 'updatedAt'])
        .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});
