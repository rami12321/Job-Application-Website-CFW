import { AssignedYouth } from "./assignedYouth";

export interface Job {

  jobId?: string;
  employerId:string;
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
