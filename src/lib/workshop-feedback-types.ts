export interface WorkshopFeedback {
  id: number;
  workshop_id: number;
  name: string;
  register_number: string;
  overall_rating: number;
  content_relevance: number;
  concept_clarity: number;
  hands_on_rating: number;
  trainer_rating: number;
  future_topics: string[];
  other_topic: string | null;
  recommendation: string;
  improvement_suggestions: string | null;
  submitted_at: string;
}

export interface WorkshopFeedbackWithEvent extends WorkshopFeedback {
  workshop_title: string;
}

export interface FeedbackEligibleWorkshop {
  id: number;
  slug: string;
  title: string;
  venue: string;
  event_date: string;
  status: string;
}

// Columns allowed in ORDER BY / search for feedback — whitelisted since column
// names can't be parameterized the way values can.
export const FEEDBACK_SORT_COLUMNS = [
  'name', 'register_number', 'overall_rating', 'trainer_rating', 'submitted_at',
] as const;
export type FeedbackSortColumn = typeof FEEDBACK_SORT_COLUMNS[number];

export interface FeedbackListParams {
  page: number;
  pageSize: number;
  search: string;
  workshopId: string; // 'all' or a numeric workshop id as a string
  sortBy: string;
  sortDir: string;
}

export interface FeedbackStats {
  total: number;
  avgOverall: number;
  avgContentRelevance: number;
  avgConceptClarity: number;
  avgHandsOn: number;
  avgTrainer: number;
}
