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


  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.jobId = id;
      if (this.jobId) {
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
    if (!this.jobId) return;
  
    this.jobRequestService.getJobById(this.jobId).subscribe({
      next: (data: Job) => {
        // Ensure assignedYouths is always an array
        this.jobRequest = {
          ...data,
          assignedYouths: data.assignedYouths || []
        };
        console.log('Fetched job request:', this.jobRequest);
      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      },
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
