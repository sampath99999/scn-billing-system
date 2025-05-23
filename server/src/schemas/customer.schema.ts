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
  is_active: z
    .boolean()
    .default(false),
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be updated',
  });

const customerSchema = {
  createCustomerSchema,
  updateCustomerSchema,
};

export default customerSchema;
