export interface WorkshopInterest {
  id: number;
  name: string;
  roll_number: string;
  college: string;
  interested: boolean;
  submitted_at: string;
}

// Columns allowed in ORDER BY / search — whitelisted since column names can't
// be parameterized the way values can.
export const INTEREST_SORT_COLUMNS = ['name', 'roll_number', 'college', 'submitted_at'] as const;
export type InterestSortColumn = typeof INTEREST_SORT_COLUMNS[number];

export interface InterestListParams {
  page: number;
  pageSize: number;
  search: string;
  college: string; // 'all' or a college name
  sortBy: string;
  sortDir: string;
}

export interface InterestStats {
  total: number;
  interestedCount: number;
  notInterestedCount: number;
  ncerc: number;
  jcet: number;
}
