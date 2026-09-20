import { z } from 'zod';

export const FUTURE_TOPICS = [
  'AI & Generative AI',
  'Web Development',
  'Full-Stack Development',
  'Machine Learning & Data Science',
  'Cloud Computing & DevOps',
  'Cybersecurity',
  'App Development',
  'Other',
] as const;
export type FutureTopic = typeof FUTURE_TOPICS[number];

export const RECOMMENDATION_OPTIONS = [
  'Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not',
] as const;
export type RecommendationOption = typeof RECOMMENDATION_OPTIONS[number];

export const workshopFeedbackSchema = z
  .object({
    workshopId: z.number({ required_error: 'Please select the workshop you attended' }).int().positive(),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and hyphens'),
    registerNumber: z
      .string()
      .min(2, 'Register number is required')
      .max(50, 'Register number too long')
      .transform((v) => v.trim().toUpperCase()),
    overallRating: z.number({ required_error: 'Please select a rating' }).int().min(1).max(5),
    contentRelevance: z.number({ required_error: 'Please select a rating' }).int().min(1).max(5),
    conceptClarity: z.number({ required_error: 'Please select a rating' }).int().min(1).max(5),
    handsOnRating: z.number({ required_error: 'Please select a rating' }).int().min(1).max(5),
    trainerRating: z.number({ required_error: 'Please select a rating' }).int().min(1).max(5),
    futureTopics: z.array(z.enum(FUTURE_TOPICS)).min(1, 'Please select at least one topic'),
    otherTopic: z.string().max(200).optional().default(''),
    recommendation: z.enum(RECOMMENDATION_OPTIONS, {
      errorMap: () => ({ message: 'Please select an option' }),
    }),
    improvementSuggestions: z.string().max(2000).optional().default(''),
  })
  .refine((data) => !data.futureTopics.includes('Other') || data.otherTopic.trim().length > 0, {
    message: 'Please specify the other topic',
    path: ['otherTopic'],
  });

export type WorkshopFeedbackData = z.infer<typeof workshopFeedbackSchema>;
