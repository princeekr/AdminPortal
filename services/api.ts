
import { Registration, RegistrationType } from '../types';

/**
 * READ-ONLY DATA SOURCE
 * This service only provides methods to fetch data from the central registration database.
 */

const MOCK_DATA: Registration[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', registration_type: RegistrationType.PROFESSIONAL, company: 'Tech Corp', phone: '+1 (555) 123-4567', created_at: '2024-03-10T10:30:00Z' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@uni.edu', registration_type: RegistrationType.STUDENT, phone: '+1 (555) 987-6543', created_at: '2024-03-11T14:20:00Z' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus.j@innovate.io', registration_type: RegistrationType.PROFESSIONAL, company: 'Innovate AI', created_at: '2024-03-12T09:15:00Z' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena.r@stanford.edu', registration_type: RegistrationType.STUDENT, created_at: '2024-03-08T16:45:00Z' },
  { id: '5', name: 'David Kim', email: 'd.kim@globalsoft.com', registration_type: RegistrationType.PROFESSIONAL, company: 'GlobalSoft', phone: '+1 (555) 234-5678', created_at: '2024-03-13T11:00:00Z' },
  { id: '6', name: 'Jamie Vardy', email: 'jvardy@college.ac.uk', registration_type: RegistrationType.STUDENT, created_at: '2024-03-14T08:30:00Z' },
  { id: '7', name: 'Samantha Wu', email: 'swu@design.studio', registration_type: RegistrationType.PROFESSIONAL, company: 'Creative Edge', phone: '+1 (555) 345-6789', created_at: '2024-03-05T13:10:00Z' },
  { id: '8', name: 'Robert Brown', email: 'rbrown@stateu.edu', registration_type: RegistrationType.STUDENT, created_at: '2024-03-09T15:20:00Z' },
  { id: '9', name: 'Lisa Taylor', email: 'lisa.t@fintech.com', registration_type: RegistrationType.PROFESSIONAL, company: 'FinTech Solutions', phone: '+1 (555) 456-7890', created_at: '2024-03-15T12:05:00Z' },
  { id: '10', name: 'Kevin Lee', email: 'klee@techy.com', registration_type: RegistrationType.PROFESSIONAL, company: 'Techy Inc', phone: '+1 (555) 567-8901', created_at: '2024-03-16T17:40:00Z' },
  { id: '11', name: 'Sophie Martin', email: 'smartin@polytech.fr', registration_type: RegistrationType.STUDENT, created_at: '2024-03-17T10:00:00Z' },
  { id: '12', name: 'Niko Bellic', email: 'niko@liberty.com', registration_type: RegistrationType.PROFESSIONAL, company: 'LCPD', phone: '+1 (555) 678-9012', created_at: '2024-03-18T09:00:00Z' },
];

/**
 * Fetches all registrations for the admin portal.
 * In a real scenario, this would call the GET /api/registrations endpoint.
 */
export const fetchRegistrations = async (): Promise<Registration[]> => {
  return new Promise((resolve) => {
    // Network latency simulation
    setTimeout(() => resolve([...MOCK_DATA]), 600);
  });
};
