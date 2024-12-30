export interface AssignedYouth {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  cv: string;
  status: string;
  action?: 'accepted' | 'rejected' | 'approved' | null;
  isDisabled?: boolean;
  EmployerContract?: {
    startDate: string;
    signature: string;
    agreementAccepted: boolean;
  };
  YouthContract?: {
    signature: string;
    agreementAccepted: boolean;
  };
}
