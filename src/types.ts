export enum RegistrationType {
  STUDENT = "student",
  PROFESSIONAL = "professional",
}

export type SortOrder = "newest" | "oldest";

export type ColumnVisibility = {
  phone: boolean;
  company: boolean;
  date: boolean;
};

export interface Registration {
  _id: string;              // ✅ MongoDB ID
  name: string;
  email: string;
  registration_type: RegistrationType;
  company?: string;
  phone?: string;
  created_at: string;
}
