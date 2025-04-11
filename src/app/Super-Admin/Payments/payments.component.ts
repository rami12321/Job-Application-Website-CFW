import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { YouthTableComponent } from '../../Common/youth-table/youth-table.component';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';
import { PaymentService } from '../../Services/PaymentService/payment.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, YouthTableComponent, JobRequestDetailsComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  isGeneratingPayments = false;
  isCheckingPayments = false;
  paymentGenerationResult: any = null;
  eligibleYouths: any[] = [];
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  showErrorDetails = false;
  staticJobRequestId = 'J-93425324';
activeAdminTab: string = 'working';
  constructor(
    private paymentService: PaymentService,
    private youthService: YouthServiceService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.loadEligibleYouths(true); // Default to working status
  }

// Update the setActiveTab method
setActiveTab(tab: 'working' | 'finished'): void {
  this.activeAdminTab = tab;
  this.loadEligibleYouths(tab === 'working');
  this.cdr.detectChanges(); // Force change detection
}
  loadEligibleYouths(workStatus: boolean): void {
    this.errorMessage = null;
    this.infoMessage = null;

    this.youthService.getYouthsByStatus('accepted', workStatus).subscribe({
      next: (youths) => {
        this.eligibleYouths = youths;
        if (youths.length === 0) {
          this.infoMessage = `No ${workStatus ? 'working' : 'finished'} youths found with accepted status.`;
        }
      },
      error: (err) => {
        console.error('Error loading eligible youths:', err);
        this.errorMessage =
          err.message || 'Failed to load eligible youths. Please try again.';
      },
    });
  }

  async generateAllPayments(): Promise<void> {
    if (this.eligibleYouths.length === 0) {
      this.errorMessage = 'No eligible youths found';
      return;
    }

    this.isGeneratingPayments = true;
    this.errorMessage = null;
    this.infoMessage = 'Preparing payment data...';

    try {
      // Create properly formatted youthJobPairs
      const youthJobPairs = this.eligibleYouths.map((youth) => ({
        youthId: youth.id,
        jobRequestId: this.staticJobRequestId,
      }));

      // Validate the pairs before sending
      if (!youthJobPairs.every((pair) => pair.youthId && pair.jobRequestId)) {
        throw new Error('Invalid youth-job pairs format');
      }

      this.infoMessage = 'Generating payments...';

      this.paymentService
        .generatePaymentsForMultipleYouth(youthJobPairs)
        .pipe(
          finalize(() => {
            this.isGeneratingPayments = false;
          })
        )
        .subscribe({
          next: (result) => {
            this.paymentGenerationResult = result; // Store result in component state
            this.showPaymentResults(result);
          },
          error: (err) => {
            this.handlePaymentError(err); // Properly call error handler
          },
        });
    } catch (error) {
      this.isGeneratingPayments = false;
      this.errorMessage =
        error instanceof Error ? error.message : 'Failed to prepare payments';
      console.error('Payment preparation error:', error);
    }
  }

  private handlePaymentError(err: any): void {
    console.error('Payment error:', err);
    this.errorMessage = err.message || 'Payment generation failed';

    if (err.error) {
      if (err.error.failedPayments) {
        this.paymentGenerationResult = {
          failedPayments: err.error.failedPayments // Ensure this is set
        };

        const failedCount = err.error.failedPayments.length;
        this.errorMessage = `${failedCount} payments failed`;

        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      } else if (err.error.message) {
        this.errorMessage = err.error.message;
      }
    }
  }


  private async checkExistingPayments(
    pairs: any[]
  ): Promise<{ hasExisting: boolean; message: string }> {
    try {
      const youthIds = pairs.map((p) => p.youthId);
      const existingPayments = await this.paymentService
        .getPaymentsByYouthIds(youthIds)
        .toPromise();

      // Now existingPayments will always be an array (never undefined)
      if (existingPayments && existingPayments.length > 0) {
        const existingIds = existingPayments.map((p) => p.youthId).join(', ');
        return {
          hasExisting: true,
          message: `These youths already have payments: ${existingIds}`,
        };
      }
      return { hasExisting: false, message: '' };
    } catch (error) {
      console.error('Check existing payments error:', error);
      return {
        hasExisting: false,
        message: 'Error checking for existing payments',
      };
    }
  }

  private showPaymentResults(result: any): void {
    const successCount = result.successfulPayments?.length || 0;
    const failedCount = result.failedPayments?.length || 0;

    if (successCount > 0) {
      this.infoMessage = `Successfully processed ${successCount} payments`;
    }

    if (failedCount > 0) {
      this.errorMessage = `${failedCount} payments failed`;
    }
  }

  toggleErrorDetails(): void {
    this.showErrorDetails = !this.showErrorDetails;
  }
}
