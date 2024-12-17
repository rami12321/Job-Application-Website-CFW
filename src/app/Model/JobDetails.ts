import { AssignedYouth } from "./assignedYouth";

export interface Job {

  id?: string;
  employerId:string;
  job: string;
  title?: string;
  numEmployees: number;
  level: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status:string;
    assignedYouths?: AssignedYouth[];
  
}
