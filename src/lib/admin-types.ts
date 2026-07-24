export interface Registration {
  id: number;
  temp_emp_number: string;
  full_name: string;
  dob: string;
  department: string;
  phone: string;
  college: string;
  instagram: string | null;
  year: string;
  course: string;
  resume_url: string | null;
  address: string;
  email: string;
  photo_url: string | null;
  portfolio_link: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Columns allowed in ORDER BY / search — whitelisted to prevent SQL identifier injection
// since column names can't be parameterized like values can.
export const SORT_COLUMNS = ['full_name', 'email', 'created_at', 'status', 'college', 'course', 'temp_emp_number'] as const;
export type SortColumn = typeof SORT_COLUMNS[number];

export interface RegistrationListParams {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  sortBy: string;
  sortDir: string;
}

export interface RegistrationStats {
  total: number;
  today: number;
  pending: number;
  approved: number;
  rejected: number;
}
