import { Youth } from "./youth";
export interface Job {

  id?: string;
  employerId:string;
  title: string;
  numEmployees: number;
  level: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status:string;
  assignedYouth: string[]; // Array of Youth IDs or references
}
