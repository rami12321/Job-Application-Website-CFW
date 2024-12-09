// job.model.ts
// export class Job {
//   id?: string;
//   title: string;
//   numEmployees: number;
//   level: string;
//   location: string;
//   typeOfJob: string;
//   supervisorName: string;
//   supervisorPosition: string;
//   supervisorEmail: string;
//   supervisorPhone: string;

//   constructor(
//   id?: string="",
//     title: string = '',
//     numEmployees: number = 0,
//     level: string = '',
//     location: string = '',
//     typeOfJob: string = '',
//     supervisorName: string = '',
//     supervisorPosition: string = '',
//     supervisorEmail: string = '',
//     supervisorPhone: string = ''
//   ) {
//     this.id=id;
//     this.title = title;
//     this.numEmployees = numEmployees;
//     this.level = level;
//     this.location = location;
//     this.typeOfJob = typeOfJob;
//     this.supervisorName = supervisorName;
//     this.supervisorPosition = supervisorPosition;
//     this.supervisorEmail = supervisorEmail;
//     this.supervisorPhone = supervisorPhone;
//   }
// }

export interface Job {

  id?: string;
  title: string;
  numEmployees: number;
  level: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
}
