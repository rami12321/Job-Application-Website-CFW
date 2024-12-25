import { Component, Input, SimpleChanges } from '@angular/core';
import { Job } from '../../Model/JobDetails';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';

@Component({
  selector: 'app-job-request-details',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FormsModule],
  templateUrl: './job-request-details.component.html',
  styleUrl: './job-request-details.component.css',
})
export class JobRequestDetailsComponent {
  @Input() jobId: string | null = null;
  public jobRequest: Job | undefined;
  isApprovalModalOpen: boolean = false;
  selectedYouth: any | null = null;

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
  approvedCount: number = 0;
  isSubmitEnabled: boolean = false;
  paginatedAssignedYouths: any[] = [];
  isrevertModalOpen = false;
  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private youthService: YouthServiceService

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
  openRevertModal(youth: any): void {
    this.isrevertModalOpen = true;
    this.modalAction = 'reset';
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;
    this.selectedYouth = youth;
  }

  confirmRevert(): void {
    if (this.selectedYouth) {

      this.selectedYouth.action = 'accepted';


      this.jobRequestService
        .updateJob(this.jobId!, { assignedYouths: this.jobRequest!.assignedYouths })
        .subscribe({
          next: () => {
            console.log(`Youth status reverted to: ${this.selectedYouth.action}`);
            this.fetchJobRequestDetails();
            this.closeRModal();
          },
          error: (err) => {
            console.error('Error reverting youth status:', err);
            this.closeRModal();
          },
        });
    }
  }

  closeApprovalModal(): void {
    this.isApprovalModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }
  openApprovalModal(youth: any, action: string): void {
    this.isApprovalModalOpen = true;
    this.modalAction = action;
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;
    this.selectedYouth = youth;
  }
  closeRModal(): void {
    this.isrevertModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }
  closeModal(): void {
    this.isModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }
  confirmApproval(): void {
    if (this.selectedYouth) {
      if (this.modalAction === 'approve') {
        this.selectedYouth.action = 'approved';
      } else if (this.modalAction === 'reset') {
        this.selectedYouth.action = 'accepted';
      }

      this.jobRequestService
        .updateJob(this.jobId!, { assignedYouths: this.jobRequest!.assignedYouths })
        .subscribe({
          next: () => {
            console.log(`Youth status updated to: ${this.selectedYouth.action}`);
            this.fetchJobRequestDetails();
          },
          error: (err) => console.error('Error updating youth status:', err),
        });
      this.isApprovalModalOpen = false;

    }
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
        this.updatePagination();
        this.initializeRowStates();

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
      status: action === 'accepted' ? 'approved' : 'rejected',
    };


    this.jobRequestService
      .updateJob(this.jobId, { assignedYouths: this.jobRequest.assignedYouths })
      .subscribe({
        next: () => console.log(`Youth status updated successfully to: ${action}`),
        error: (err) => console.error('Error updating youth status:', err),
      });
  }

  updateRowStates(): void {
    if (this.jobRequest) {
      this.approvedCount = this.jobRequest.assignedYouths?.filter(
        (youth) => youth.action === 'approved'
      ).length || 0;

      this.jobRequest.assignedYouths?.forEach((youth) => {

        youth.isDisabled =
          this.approvedCount >= this.jobRequest!.numEmployees && youth.action !== 'approved';
      });


      this.isSubmitEnabled = this.approvedCount === this.jobRequest.numEmployees;
    }
  }
  submitJobRequests(): void {
    if (!this.jobRequest || !this.jobId) {
      console.error('Job request or job ID is undefined.');
      return;
    }
  
    // Update the assigned youth statuses
    const updatedYouths =
      this.jobRequest.assignedYouths
        ?.filter((youth) => !(youth.isDisabled && youth.action !== 'approved'))
        .map((youth) => ({
          ...youth,
          status: youth.action === 'approved' ? 'approved' : youth.status,
        })) ?? [];
  
    const updatedJobRequest = {
      ...this.jobRequest,
      assignedYouths: updatedYouths,
      status: 'in-progress',
    };
  
    // Update the job request
    this.jobRequestService.updateJob(this.jobId, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request submitted successfully.');
  
        updatedYouths.forEach((youth) => {
          const isApproved = youth.status === 'approved';
  
          // Update the applied jobs for the youth
          this.updateYouthAppliedJobs(
            youth.id, // Youth ID
            this.jobRequest?.job || '', // Current job title
            isApproved ? 'approved' : 'rejected'
          );
        });
  
        setTimeout(() => {
          window.location.reload();
        }, 500); // Optional: Small delay for smoother reload
      },
      error: (err) => console.error('Error submitting job request:', err),
    });
  }
  
  /**
   * Updates the status of all applied jobs for a youth.
   * @param youthId - The ID of the youth
   * @param currentJobTitle - The title of the current job to approve/reject
   * @param newStatus - The new status for the current job
   */
  updateYouthAppliedJobs(
    youthId: any,
    currentJobTitle: string,
    newStatus: string
  ): void {
    this.youthService.getYouthById(youthId).subscribe({
      next: (youth) => {
        if (youth && youth.appliedJob) {
          console.log('Fetched youth record:', youth);
  
          // Update statuses for all applied jobs
          const updatedAppliedJobs = youth.appliedJob.map(
            (job: { job: string; status: string }) => {
            if (job.job === currentJobTitle) {
              return { ...job, status: newStatus }; // Update current job
            } else if (job.status === 'waiting') {
              return { ...job, status: 'rejected' }; // Reject other waiting jobs
            }
            return job; // Retain other statuses
          });
  
          const updatedYouth = { ...youth, appliedJob: updatedAppliedJobs };
  
          this.youthService.updateYouth(youthId, updatedYouth).subscribe({
            next: () =>
              console.log(
                `Successfully updated applied jobs for youth ID: ${youthId}`
              ),
            error: (err) =>
              console.error(`Error updating youth record for ID: ${youthId}`, err),
          });
        } else {
          console.error(`Youth record or applied jobs not found for ID: ${youthId}`);
        }
      },
      error: (err) =>
        console.error(`Error fetching youth data for ID: ${youthId}`, err),
    });
  }
  


  initializeRowStates(): void {
    this.approvedCount = this.jobRequest?.assignedYouths?.filter(
      (youth) => youth.action === 'approved'
    ).length || 0;

    const numEmployee = this.jobRequest?.numEmployees ?? 0;
    this.updateRowStates();
    this.isSubmitEnabled = this.approvedCount === numEmployee;
  }



  toggleYouthStatus(youth: any, action: string | null): void {
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


}
