export interface EmployerContract {
  startDate: string;
  signature: string;
  agreementAccepted: boolean;
  workingSchedule?: { [day: string]: { workType: string; shift: string } };
  averageWorkingHours?: number;
  workingNotes?: string;
}

export interface AssignedYouth {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  mobilePhone: string;
  cv: string;
  status: string;
  action?: 'accepted' | 'rejected' | 'approved' | null;
  isDisabled?: boolean;
  EmployerContract?: EmployerContract;
  YouthContract?: {
    mobilePhone: string;
    startDate: string | null;
    signature: string;
    agreementAccepted: boolean;
  };
}
