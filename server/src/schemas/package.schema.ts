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
        .max(10000, 'Price per month must be less than or equal to 10000'),
});
