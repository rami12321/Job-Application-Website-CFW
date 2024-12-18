import { Component, Input, SimpleChanges } from '@angular/core';
import { Job } from '../../Model/JobDetails';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-request-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-request-details.component.html',
  styleUrl: './job-request-details.component.css'
})
export class JobRequestDetailsComponent {
  @Input() jobId: string | null = null;
  public jobRequest: Job | undefined;
  isEditing: { [key: string]: boolean } = {};
  editModels: { [key: string]: any } = {};
  isModalOpen = false;
  modalImage: string = '';
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  isEditingSignature = false;
  modalAction: string = ''; // Store the action (Accept/Reject/Submit)
  selectedYouthName: string = ''; // Name of the youth
  isSubmitModalOpen = false; // To manage Submit modal visibility

  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch jobId directly from the route parameters
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      console.log('Retrieved jobId from route:', jobId);
  
      if (jobId) {
        this.jobId = jobId;
        this.fetchJobRequestDetails();
      } else {
        console.error('Invalid or missing jobId');
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && this.jobId) {
      this.fetchJobRequestDetails();
    }
  }

  
  fetchJobRequestDetails(): void {
    if (!this.jobId) {
      console.error('Missing jobId, cannot fetch data');
      return;
    }

    this.jobRequestService.getJobById(this.jobId).subscribe({
      next: (data: Job) => {
        console.log('Job request fetched successfully:', data);
        this.jobRequest = {
          ...data,
          assignedYouths: data.assignedYouths || []
        };
      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      },
    });
  }
  
  // Toggle Youth Status
  toggleYouthStatus(youth: any, action: string | null): void {
    youth.action = action;
  }

  // Check if Submit Button Should be Enabled
  isSubmitEnabled(): boolean {
    return this.jobRequest?.assignedYouths?.some(youth => youth.action === 'accepted' || youth.action === 'rejected') || false;
  }

  // Submit Job Request
  submitJobRequest(): void {
    if (!this.jobRequest || !this.jobId) return;

    // Update job request status
    const updatedYouths = this.jobRequest.assignedYouths?.map(youth => ({
      ...youth,
      status: youth.action === 'accepted' ? 'assigned' : youth.status === 'rejected' ? 'rejected' : youth.status,
    }));

    const updatedJobRequest = {
      ...this.jobRequest,
      assignedYouths: updatedYouths,
      status: 'assigned-E', 
    };

    // Call service to update job request
    this.jobRequestService.updateJob(this.jobId, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request submitted successfully');
        this.fetchJobRequestDetails(); // Refresh data
      },
      error: err => console.error('Error submitting job request:', err),
    });
  }

  startEditing(): void {
    this.isEditing['details'] = true;
    this.editModels = { ...this.jobRequest };
  }

  saveChanges(): void {
    if (!this.editModels) return;

    if (this.jobRequest) {
      Object.assign(this.jobRequest, this.editModels);
    }

    this.jobRequestService.updateJob(this.jobId!, this.editModels).subscribe({
      next: () => {
        console.log('Job request updated successfully');
        this.isEditing['details'] = false;
      },
      error: (err) => {
        console.error('Error updating job request:', err);
      }
    });
  }

  cancelEditing(): void {
    this.isEditing['details'] = false;
    this.editModels = {};
  }

  openModal(imageSrc: string): void {
    this.modalImage = imageSrc;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
