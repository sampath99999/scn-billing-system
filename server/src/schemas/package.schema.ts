import { PACKAGE_TYPES } from '#types/Package.js';
import { z } from 'zod';

export const createPackageSchema = z.object({
    name: z
        .string({ message: 'Package Name is required' })
        .min(1, 'Package Name is required')
        .max(50, 'Package Name must be less than 50 characters'),
    package_type: z
        .string({ message: 'Package type is required' })
        .refine((val) => Object.values(PACKAGE_TYPES).includes(val), {
            message: 'Package type must be either Add On or Package',
        }),
    price_per_month: z
        .number({ message: 'Price per month is required' })
        .min(0, 'Price per month must be greater than or equal to 0')
        .max(10000, 'Price per month must be less than or equal to 10000')
        .int('Price per month must be an integer'),
});

export const packageQuerySchema = z.object({
    searchTerm: z.string().optional(),
    package_type: z
        .string()
        .refine((val) => Object.values(PACKAGE_TYPES).includes(val), {
            message: 'Package type must be either add_on or package',
        })
        .optional(),
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
        .enum(['name', 'price_per_month', 'package_type', 'createdAt', 'updatedAt'], {
            message: 'Sort by must be one of the following: Name, Price per Month, Package Type, Created At, Updated At',
        })
        .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});
