import { Component, Input, SimpleChanges } from '@angular/core';
import { Job } from '../../Model/JobDetails';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import this

@Component({
  selector: 'app-job-request-details',
  standalone: true,
  imports: [CommonModule, MatTooltipModule,FormsModule],
  templateUrl: './job-request-details.component.html',
  styleUrl: './job-request-details.component.css',
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
  modalAction: string = '';
  selectedYouthName: string = '';
  isSubmitModalOpen = false;
  userRole: string | null = localStorage.getItem('role');
  currentPage = 1;
  itemsPerPage = 3;
  searchQuery = '';
  paginatedAssignedYouths: any[] = [];

  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      console.log('Retrieved jobId from route:', jobId);
      const role = this.route.snapshot.queryParamMap.get('role') || localStorage.getItem('role');
      this.userRole = role;
      console.log('User role:', this.userRole);

      if (jobId) {
        this.jobId = jobId;
        this.fetchJobRequestDetails();
      } else {
        console.error('Invalid or missing jobId');
      }
    });
    this.updatePagination();


  }
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAssignedYouths = this.jobRequest?.assignedYouths?.slice(startIndex, endIndex) || [];
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  
  get totalPages(): number {
    return Math.ceil((this.jobRequest?.assignedYouths?.length || 0) / this.itemsPerPage);
  }
  
  searchAssignedYouths() {
    const query = this.searchQuery.toLowerCase();
    const filtered = this.jobRequest?.assignedYouths?.filter(
      (youth) =>
        youth.firstName.toLowerCase().includes(query) ||
        youth.lastName.toLowerCase().includes(query)
    );
    this.jobRequest!.assignedYouths = filtered || [];
    this.currentPage = 1;
    this.updatePagination();
  }
  get hasAssignedYouths(): boolean {
    return !!this.jobRequest?.assignedYouths?.length;
  }
  
  navigateToRole(role: string): void {
    localStorage.setItem('role', role);
    this.userRole = role;
    this.router.navigate([role === 'Admin' ? '/admin' : '/main-employer'], {
      queryParams: { role },
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
          assignedYouths: data.assignedYouths || [],
        };
        this.updatePagination(); // Ensure pagination updates after fetching data

      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      },
    });
  }


  updateYouthStatus(youth: any, action: 'accepted' | 'rejected'): void {
    if (!this.jobRequest || !this.jobId) return;


    youth.action = action;


    const updatedYouth = {
      ...youth,
      status: action === 'accepted' ? 'assigned' : 'rejected',
    };


    this.jobRequestService
      .updateJob(this.jobId, { assignedYouths: this.jobRequest.assignedYouths })
      .subscribe({
        next: () => console.log(`Youth status updated successfully to: ${action}`),
        error: (err) => console.error('Error updating youth status:', err),
      });
  }


  toggleYouthStatus(youth: any, action: string | null): void {

    if (!this.isEmployer()) {
      console.error('Non-employers cannot change youth statuses.');
      return;
    }

    if (action) {

      this.updateYouthStatus(youth, action as 'accepted' | 'rejected');
    } else {

      youth.action = null;
      youth.status = 'waiting';

      if (this.jobRequest && this.jobId) {
        this.jobRequestService
          .updateJob(this.jobId, { assignedYouths: this.jobRequest.assignedYouths })
          .subscribe({
            next: () => console.log(`Youth status reset to 'waiting'`),
            error: (err) => console.error('Error resetting youth status:', err),
          });
      }
    }
  }






  submitJobRequest(): void {
    if (!this.jobRequest || !this.jobId) return;

    const updatedYouths = this.jobRequest.assignedYouths?.map((youth) => ({
      ...youth,
      status:
        youth.action === 'accepted'
          ? 'assigned'
          : youth.status === 'rejected'
            ? 'rejected'
            : youth.status,
    }));

    const updatedJobRequest = {
      ...this.jobRequest,
      assignedYouths: updatedYouths,
      status: 'assigned-E',
    };


    this.jobRequestService.updateJob(this.jobId, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request submitted successfully');
        this.fetchJobRequestDetails();
      },
      error: (err) => console.error('Error submitting job request:', err),
    });
  }


  isEmployer(): boolean {
    return this.userRole === 'Employer';
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin' || !this.userRole;
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
      },
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
