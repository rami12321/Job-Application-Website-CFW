export interface Admin {
    id?: string;
    active: boolean;
    fullNameArabic: string;
    fullNameEnglish: string;
    personalEmail: string;
    organizationEmail: string;
    position: string;
    area: string;
    phoneNumber: string;
    role: string; 
    password?: string; // Optional password field

  }
  