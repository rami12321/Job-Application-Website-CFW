import { AssignedYouth } from "./assignedYouth";

export interface Job {

  jobId?: string;
  employerId:string;
  employerLatitude?: number;   // New field for employer latitude
  employerLongitude?: number; 
  job: string;
  category?: string;  // Main category (e.g., "Design")
  title?: string;
  numEmployees: number;
  organizationName?:string;
  level: string;
  area: string;
  campType: string;
  camp?: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status:string;
  assignedYouths?: AssignedYouth[];
  createdDate?: string; // Add this property


}
