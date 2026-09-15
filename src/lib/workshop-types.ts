export interface Workshop {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  venue: string;
  event_date: string;
  banner_url: string | null;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
}

export interface WorkshopWithCounts extends Workshop {
  registration_count: number;
}

export interface WorkshopRegistration {
  id: number;
  workshop_id: number;
  pass_code: string;
  full_name: string;
  email: string;
  phone: string;
  year: string;
  course: string;
  department: string | null;
  status: 'pending' | 'approved' | 'rejected';
  checked_in_at: string | null;
  created_at: string;
}

export interface WorkshopRegistrationWithEvent extends WorkshopRegistration {
  workshop_title: string;
  workshop_venue: string;
  workshop_event_date: string;
}

// Columns allowed in ORDER BY / search for workshop registrations — whitelisted
// since column names can't be parameterized the way values can.
export const WORKSHOP_REG_SORT_COLUMNS = [
  'full_name', 'email', 'created_at', 'status', 'course', 'pass_code',
] as const;
export type WorkshopRegSortColumn = typeof WORKSHOP_REG_SORT_COLUMNS[number];

export interface WorkshopRegListParams {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  sortBy: string;
  sortDir: string;
}

export interface WorkshopRegistrationStats {
  total: number;
  today: number;
  pending: number;
  approved: number;
  rejected: number;
  checkedIn: number;
}
