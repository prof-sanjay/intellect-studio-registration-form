import { z } from 'zod';

export const internSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and hyphens'),
  dob: z.string().refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const now = new Date();
    const ageYears = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return ageYears >= 16 && ageYears <= 35;
  }, 'You must be between 16 and 35 years old'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[\+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(10, 'Please enter your complete address')
    .max(500, 'Address too long'),
  college: z.string().min(3, 'College name is required').max(200),
  year: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'], {
    errorMap: () => ({ message: 'Please select your year of study' }),
  }),
  course: z.string().min(2, 'Course/degree is required').max(200),
  department: z.string().min(2, 'Department is required').max(100),
  instagram: z
    .string()
    .optional()
    .transform((v) => v?.replace(/^@/, '') || ''),
  portfolioLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
      'Please enter a valid URL starting with http:// or https://'
    ),
  photoUrl: z.string().min(1, 'A profile photo is required'),
  resumeUrl: z.string().optional(),
});

export type InternFormData = z.infer<typeof internSchema>;

export const STEP_FIELDS: Record<number, (keyof InternFormData)[]> = {
  0: ['fullName', 'dob', 'email', 'phone', 'address'],
  1: ['college', 'year', 'course', 'department'],
  2: ['instagram', 'portfolioLink'],
  3: ['photoUrl'],
};
