// Update your payment.service.ts with these interfaces
export interface Payment {
  id: string;
  youthId: string;
  jobRequestId: string;
  employerId: string;
  totalDaysWorked: number;
  amountPaid: number;
  paymentDate: Date;
  verificationStatus: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  payments: Payment[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}
