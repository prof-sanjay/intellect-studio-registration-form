import { z } from 'zod';

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Snake_case to match the `interns` table columns directly — this is an internal
// admin-editing schema, kept separate from the public-facing `internSchema`
// in validations.ts so the registration form's schema is never at risk of edits.
export const adminUpdateSchema = z
  .object({
    full_name: z.string().min(2).max(100),
    dob: z.string(),
    department: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    college: z.string().min(3).max(200),
    instagram: z.string().nullable(),
    year: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']),
    course: z.string().min(2).max(200),
    resume_url: z.string().nullable(),
    address: z.string().min(10).max(500),
    email: z.string().email(),
    photo_url: z.string().nullable(),
    portfolio_link: z.string().nullable(),
    status: z.enum(['pending', 'approved', 'rejected']),
  })
  .partial();

export type AdminUpdateData = z.infer<typeof adminUpdateSchema>;
