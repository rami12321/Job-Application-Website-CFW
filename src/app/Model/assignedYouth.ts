export interface AssignedYouth {
    id: number;
    firstName: string;
    lastName: string;
    dob: string; // Assuming it's a string or date format
    cv: string; // Assuming the CV is a URL or path to the file
    status: string;
    action?: 'accepted' | 'rejected' | 'approved' | null; // Optional action property
    isDisabled?: boolean; 

  }
  