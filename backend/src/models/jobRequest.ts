import { Youth } from './youth';
export interface AssignedYouth {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // Assuming it's a string or date format
  cv: string; // Assuming the CV is a URL or path to the file
  status: string;
  action?: 'accepted' | 'rejected' | 'approved' | null; // Optional action property
  isDisabled?: boolean; 

}


export interface Job {
  id?: string;
  employerId: string;
  job: string;
  category?: string;  // Main category (e.g., "Design")

  title?: string;
  numEmployees: number;
  level: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status: string;
  assignedYouths?: AssignedYouth[];
}
