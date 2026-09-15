import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTempEmpNumber(seq: number): string {
  return `IS260${seq.toString().padStart(2, '0')}`;
}

// Format: IS (Intellect Studio) + first 2 letters of the workshop title +
// event date as DDMMYY + a per-workshop sequence number.
// `eventDateStr` must be a plain 'YYYY-MM-DD' string (not a Date/ISO-with-time
// value) — parsing it as a Date and reading it back risks a local-timezone
// shift landing on the wrong calendar day.
export function generateWorkshopStudentId(title: string, eventDateStr: string, seq: number): string {
  const letters = (title.trim().slice(0, 2).toUpperCase() || 'WS').padEnd(2, 'X');
  const [yyyy, mm, dd] = eventDateStr.slice(0, 10).split('-');
  return `IS${letters}${dd}${mm}${yyyy.slice(2)}${String(seq).padStart(2, '0')}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Data Science',
  'Artificial Intelligence & ML',
  'Cybersecurity',
  'Biotechnology',
  'Mathematics & Statistics',
  'Physics',
  'Mass Communication & Journalism',
  'Business Administration',
  'Marketing',
  'Finance',
  'Design',
  'Other',
];

export const COURSES = [
  'B. Tech',
  'M. Tech',
  'B.E.',
  'BCA',
  'MCA',
  'B.Sc',
  'M.Sc',
  'B.Des',
  'M.Des',
  'MBA',
  'BBA',
  'B.Com',
  'M.Com',
  'B.Arch',
  'BA',
  'MA',
  'Diploma',
  'Other',
];

export const COLLEGES = [
  'IIT Delhi',
  'IIT Bombay',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'IIT Roorkee',
  'IIT Hyderabad',
  'IIT Bangalore (IISC)',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Surathkal',
  'NIT Calicut',
  'BITS Pilani',
  'BITS Hyderabad',
  'BITS Goa',
  'VIT Vellore',
  'SRM University',
  'Manipal University',
  'Amity University',
  'Christ University',
  'Symbiosis International University',
  'Ashoka University',
  'Delhi University',
  'Mumbai University',
  'Pune University',
  'Anna University',
  'Osmania University',
  'Bangalore University',
  'Jadavpur University',
  'Other',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] as const;
