import { z } from 'zod';

export const workshopRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and hyphens'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[\+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  year: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'], {
    errorMap: () => ({ message: 'Please select your year of study' }),
  }),
  course: z.string().min(2, 'Course/degree is required').max(200),
  department: z.string().max(100).optional().default(''),
});

export type WorkshopRegistrationData = z.infer<typeof workshopRegistrationSchema>;

// Admin schema for creating/editing a workshop event.
export const workshopSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(4000).optional().default(''),
  venue: z.string().min(2, 'Venue is required').max(200),
  eventDate: z.string().refine((v) => !isNaN(new Date(v).getTime()), 'A valid date is required'),
  bannerUrl: z.string().max(2000).optional().default(''),
  status: z.enum(['draft', 'published', 'closed']).default('published'),
});

export type WorkshopFormData = z.infer<typeof workshopSchema>;

// Snake_case, partial — used by the admin registration edit form and PUT route.
export const adminWorkshopRegUpdateSchema = z
  .object({
    full_name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    year: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']),
    course: z.string().min(2).max(200),
    department: z.string().max(100).nullable(),
    status: z.enum(['pending', 'approved', 'rejected']),
    checked_in: z.boolean(),
  })
  .partial();

export type AdminWorkshopRegUpdateData = z.infer<typeof adminWorkshopRegUpdateSchema>;
