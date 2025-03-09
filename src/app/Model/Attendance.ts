export interface DayRecord {
  day: string;
  date: Date | null;
  youthName: string;
  signature: string;
  locationChecked: boolean;
  confirmed: boolean;
  accepted: boolean;
}

export interface AttendanceRecord {
  id?: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  days: DayRecord[];
}