export interface DayRecord {
  day: string;
  date: Date | null;
  youthName: string;
  signature: string;
  locationChecked: boolean;
  confirmed: boolean;
  accepted: boolean;
  employerConfirmed: boolean; // New field for employer confirmation
  employerSignature?: string;
  adminChecked?: boolean;
}

export interface AttendanceRecord {
  id?: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  days: DayRecord[];
}
