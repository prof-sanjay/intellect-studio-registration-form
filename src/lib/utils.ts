import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTempEmpNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `IS-${year}-${random}`;
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
  'UI/UX Design',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'Digital Marketing',
  'Content Creation',
  'Graphic Design',
  'Video Production',
  'Brand Strategy',
  'Data Analytics',
  'AI/ML Research',
  'Project Management',
  'Business Development',
  'Cybersecurity',
  'DevOps',
  'QA & Testing',
  'Other',
];

export const COURSES = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.Tech Electronics & Communication',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'B.E. Computer Science',
  'BCA',
  'MCA',
  'B.Sc Computer Science',
  'B.Sc Information Technology',
  'B.Sc Mathematics',
  'B.Des',
  'M.Des',
  'MBA',
  'MBA Marketing',
  'MBA Finance',
  'M.Tech Computer Science',
  'M.Sc Computer Science',
  'BA Mass Communication',
  'BA Journalism',
  'B.Com',
  'B.Arch',
  'BBA',
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
