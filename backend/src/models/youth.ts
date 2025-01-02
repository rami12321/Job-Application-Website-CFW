export interface Youth {
  isEdited?:boolean;
  id: string;
  username: string;
  password: string;
  role: string;

  // Personal Information
  firstNameEn: string;
  fatherNameEn?: string;
  lastNameEn: string;
  firstNameAr: string;
  fatherNameAr?: string;
  lastNameAr: string;
  gender: string;
  dob: string;
  nationality: string;
  registrationStatus: string;
  familyRegistrationNumber?: string;
  personalRegistrationNumber: string;
  mobilePhone: string;
  whatsapp: string;
  email: string;
  area: string;
  campType: string;
  camp?: string;
  fullAddress: string;

  // General Information
  jobOpportunitySource: string;
  educationLevel: string;
  major: string;
  institution: string;
  graduationDate: string;
  gradplace: string;
  employmentOpportunities: string;
  aboutYourself: string;

  // General Questions
  placedByKfw: boolean;
  kfwYear?: string;
  innovationLabGraduate: boolean;
  innovationLabGradtype: string[];
  disability: boolean;
  disabilitySupport?: string;
  disabilityTypes: string[];
  employed: boolean;

  seekingEmploymentDuration?: string;
  isPrcsVolunteer: boolean;
  isFireBrigadesVolunteer: boolean;
  isAlShifaaVolunteer: boolean;

  // Experience Details
  experiences: any[];

  // Trainings and Skills
  trainings: any[];
  computerSkills: string[];
  skills?: {
    arabic: string;
    english: string;
    french: string;
  };

  // Required Documents
  cv: string;
  coverLetter?: string;
  identityCard: string;
  registrationCard: string;
  degree: string;
  prcsProof?: string;
  fireProof?: string;
  alShifaaProof?: string;
  confirmation: string;

  status: 'accepted' | 'rejected' | 'pending' | 'waiting';
  notes?:string;
  appliedJob?: { job: string; status: string }[]; // Updated to hold job and status
  beneficiary?:boolean;
  createdAt:string;
  workStatus?: boolean;

}
