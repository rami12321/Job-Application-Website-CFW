import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { YouthTableComponent } from '../../Common/youth-table/youth-table.component';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';
import { PaymentService } from '../../Services/PaymentService/payment.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    YouthTableComponent,
    JobRequestDetailsComponent,

  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  // Font Awesome icons

  isGeneratingPayments = false;
  paymentGenerationResult: any = null;
  eligibleYouths: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private youthService: YouthServiceService
  ) {}

  ngOnInit(): void {
    this.loadEligibleYouths();
  }

  loadEligibleYouths(): void {
    this.errorMessage = null;

    // Get youths with status 'accepted' and workStatus true
    this.youthService.getYouthsByStatus('accepted', true).subscribe({
      next: (youths) => {
        this.eligibleYouths = youths;
      },
      error: (err) => {
        console.error('Error loading eligible youths:', err);
        this.errorMessage = err.message || 'Failed to load eligible youths. Please try again.';
      }
    });
  }

 // In payments.component.ts

generateAllPayments(): void {
  if (this.eligibleYouths.length === 0) {
    this.errorMessage = 'No eligible youths found';
    return;
  }

  if (!confirm(`Generate payments for ${this.eligibleYouths.length} youth?`)) {
    return;
  }

  this.isGeneratingPayments = true;
  this.errorMessage = null;

  // Prepare youth-job pairs with only those having admin-checked days
  const youthJobPairs = this.eligibleYouths
    .filter(youth => youth.id && this.hasAdminCheckedDays(youth))
    .map(youth => ({
      youthId: youth.id,
      jobRequestId: this.getJobRequestId(youth)
    }));

  if (youthJobPairs.length === 0) {
    this.isGeneratingPayments = false;
    this.errorMessage = 'No youth with admin-verified attendance days found';
    return;
  }

  this.paymentService.generatePaymentsForMultipleYouth(youthJobPairs)
    .subscribe({
      next: (result) => {
        this.paymentGenerationResult = result;
        this.isGeneratingPayments = false;

        this.showPaymentResults(result);
        this.loadEligibleYouths(); // Refresh data
      },
      error: (err) => {
        console.error('Payment error:', err);
        this.isGeneratingPayments = false;
        this.errorMessage = err.error?.message || 'Payment generation failed';
      }
    });
}

private hasAdminCheckedDays(youth: any): boolean {
  // Implement logic to check if youth has any admin-checked days
  // This might require an additional API call to check attendance records
  return true; // Placeholder - implement actual check
}

private showPaymentResults(result: any): void {
  const successCount = result.successfulPayments?.length || 0;
  const failedCount = result.failedPayments?.length || 0;
  const totalAmount = result.totalAmount || 0;
  const totalDays = result.totalDaysPaid || 0;

  const message = `Payments generated:
    \n- Successful: ${successCount} youth
    \n- Days paid: ${totalDays}
    \n- Total amount: $${totalAmount.toFixed(2)}
    \n- Failed: ${failedCount}`;

  alert(message);
}

  // Helper to get job request ID from youth's applied jobs
  private getJobRequestId(youth: any): string | null {
    if (!youth.appliedJob || !Array.isArray(youth.appliedJob)) return null;

    const acceptedJob = youth.appliedJob.find((job: any) => job.status === 'accepted');
    return acceptedJob?.jobRequestId || null;
  }
}