export interface AssignedYouth {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // Assuming it's a string or date format
  cv: string; // Assuming the CV is a URL or path to the file
  status: string;
}

export interface Employer {
  id?: string;
  active:boolean;
  username: string;
  password: string;
  organization: string;
  fullNameEnglish: string;
  fullNameArabic: string;
  mobilePhone: string;
  whatsappNumber?: string;
  email: string;
  area: string;
  signature: string | null;
  profileImage?: string;
  assignedYouths?: AssignedYouth[];
}
