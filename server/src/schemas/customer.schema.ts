import { z } from 'zod';

export const createCustomerSchema = z.object({
  first_name: z
    .string({ message: 'First name is required' })
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string({ message: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  care_of: z
    .string({ message: 'Care of is required' })
    .min(1, 'Care of is required')
    .max(100, 'Care of must be less than 100 characters'),
  phone: z
    .string({ message: 'Phone number is required' })
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters'),
  address: z
    .string({ message: 'Address is required' })
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  box_no: z
    .string({ message: 'Box number is required' })
    .min(1, 'Box number is required')
    .max(20, 'Box number must be less than 20 characters'),
  note: z
    .string({ message: 'Note is required' })
    .min(1, 'Note is required')
    .max(500, 'Note must be less than 500 characters'),
  latitude: z
    .number({ message: 'Latitude must be a number' })
    .optional(),
  longitude: z
    .number({ message: 'Longitude must be a number' })
    .optional(),
  old_due: z
    .number({ message: 'Old due must be a number' })
    .min(0, 'Old due must be greater than or equal to 0')
    .default(0),
  // Removed is_active - will default to false (pending approval)
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be updated',
  });

export const customerQuerySchema = z.object({
  searchTerm: z.string().optional(),
  is_active: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  has_due: z
    .string()
    .transform((val) => val === 'true')
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
    .enum(['first_name', 'last_name', 'phone', 'address', 'box_no', 'old_due', 'createdAt', 'updatedAt'], {
      message: 'Sort by must be one of the following: first_name, last_name, phone, address, box_no, old_due, createdAt, updatedAt',
    })
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const updateCustomerStatusSchema = z.object({
  is_active: z.boolean({ message: 'is_active must be a boolean' }),
});

const customerSchema = {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
  updateCustomerStatusSchema,
};

export default customerSchema;
