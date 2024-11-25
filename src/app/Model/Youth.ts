export interface PersonalInformation {

}

export interface GeneralInformation {

}

export interface GeneralQuestions {

}

export interface ExperienceDetails {
  experiences: any[]; // Define the structure based on your needs
}

export interface TrainingsAndSkills {
  trainings: any[]; // Define the structure based on your needs
}

export interface Youth {
  id: string;
  username : string;
  password : string;
  role : string;
  firstNameEn: string;
  lastNameEn: string;
  gender: string;
  dob: string;
  nationality: string;
  mobilePhone: string;
  whatsapp: string;
  email: string;
  area: string;
  fullAddress: string;
  campType: string;
  camp: string;
  jobOpportunitySource: string;
  educationLevel: string;
  major: string;
  institution: string;
  graduationDate: string;
  gradplace: string;
  employmentOpportunities: string;
  aboutYourself: string;
  placedByKfw: boolean;
  kfwYear: string;
  innovationLabGraduate: boolean;
  disability: boolean;
  disabilitySupport: string;
  employed: boolean;
  seekingEmploymentDuration: string;
  isPrcsVolunteer: boolean;
  isFireBrigadesVolunteer: boolean;
  isAlShifaaVolunteer: boolean;
  experienceDetails: ExperienceDetails;
  trainingsAndSkills: TrainingsAndSkills;
  requiredDocuments: any[]; // Define the structure based on your needs
}
