import { Youth } from './youth';
export interface AssignedYouth {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  cv: string;
  status: string;

}

export interface Job {
  jobId?: string;
  employerId: string;
  job: string;
  category?: string;  // Main category (e.g., "Design")
  organizationName?:string;
  title?: string;
  numEmployees: number;
  level: string;
  area?:string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status: string;
  assignedYouths?: AssignedYouth[];
}
