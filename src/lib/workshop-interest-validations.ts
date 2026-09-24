import { z } from 'zod';

export const COLLEGE_OPTIONS = ['NCERC', 'JCET', 'Other'] as const;
export type CollegeOption = typeof COLLEGE_OPTIONS[number];

export const workshopInterestSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and hyphens'),
    rollNumber: z
      .string()
      .min(2, 'Roll number is required')
      .max(50, 'Roll number too long')
      .transform((v) => v.trim().toUpperCase()),
    college: z.enum(COLLEGE_OPTIONS, {
      errorMap: () => ({ message: 'Please select your college' }),
    }),
    otherCollege: z.string().max(200).optional().default(''),
    interested: z.boolean({ required_error: 'Please let us know if you are interested' }),
  })
  .refine((data) => data.college !== 'Other' || data.otherCollege.trim().length > 0, {
    message: 'Please enter your college name',
    path: ['otherCollege'],
  });

export type WorkshopInterestData = z.infer<typeof workshopInterestSchema>;
