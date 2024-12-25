export interface Employer {
  id?: string;
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
    role: string;
    active:boolean,

}
