
export enum RegistrationType {
  STUDENT = 'Student',
  PROFESSIONAL = 'Professional'
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  registration_type: RegistrationType;
  company?: string;
  phone?: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  students: number;
  professionals: number;
}

export type SortOrder = 'newest' | 'oldest';

export interface ColumnVisibility {
  phone: boolean;
  company: boolean;
  date: boolean;
}
