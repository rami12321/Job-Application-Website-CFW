import { Component } from '@angular/core';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Job } from '../../Model/JobDetails';
import { JobRequestDetailsComponent } from '../JobRequestDetails/job-request-details.component';
import { JobRequestComponent } from '../JobRequestEdit/job-request.component';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-main-employer',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    JobRequestDetailsComponent,
    JobRequestComponent,
    TabViewModule
  ],
  templateUrl: './main-employer.component.html',
  styleUrls: ['./main-employer.component.css'],
})
export class MainEmployerComponent {
  displayDialog: boolean = false;
  mainCategories: any[] = [];
  selectedCategory: string = '';
  jobRequested: boolean = false;
  subcategories: string[] = [];
  allCategories: Record<string, string[]> = {};
  isDeleteModalOpen = false;
  selectedJobTitle: string | null = null;
  
  userId = localStorage.getItem('userId') || '';

  columns: { key: keyof Job; label: string }[] = [
    { key: 'id', label: 'ID' },

    { key: 'title', label: 'Job Title' },

    { key: 'location', label: 'Location' },
    { key: 'numEmployees', label: 'Number Requested' },
  ];

  jobs: Job[] = [];
  paginatedData: Job[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = true;
  selectedJobId: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedJob: Job | null = null;
  errorMessage: string | null = null;
  jobDetails: Job = {
    id: '',
    employerId: this.userId,
    job: '',
    title: '',
    numEmployees: 0,
    level: '',
    location: '',
    typeOfJob: '',
    supervisorName: '',
    supervisorPosition: '',
    supervisorEmail: '',
    supervisorPhone: '',
    status: 'waiting-E',
  };

  constructor(
    private lookupService: LookupService,
    private jobRequestService: JobRequestService
  ) { }

  ngOnInit(): void {

    this.lookupService.getJobCategories().subscribe({
      next: (data: any) => {
        if (data && data.length > 0 && data[0].categories) {
          this.mainCategories = Object.keys(data[0].categories).map((key) => ({
            label: key,
            value: key,
          }));
          this.allCategories = data[0].categories;
          console.log('Categories loaded:', this.mainCategories);
        } else {
          console.error('Unexpected category data format:', data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      },
    });
    this.sortKey = 'id';
    this.sortDirection = 'desc';
    const employerId = localStorage.getItem('userId');
    console.log('Employer ID from localStorage:', employerId);

    if (!employerId) {
      console.error('Employer ID not found in localStorage');
      this.errorMessage = 'You must be logged in to view this data';
      return;
    }


    this.fetchJobTableData(employerId);
  }
  onTabChange(event: any): void {
    const statusMap = ['waiting-E', 'assigned-E', 'in-progress', 'completed'];
    const selectedStatus = statusMap[event.index];
    this.paginatedData = this.jobsByStatus(selectedStatus);
    this.totalPages = Math.ceil(this.paginatedData.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
  }
  jobsByStatus(status: string): Job[] {
  return this.jobs.filter((job) => job.status === status);
}

  openEditModal(jobId: string): void {
    this.selectedJobId = jobId;
    this.isEditModalOpen = true;
  }
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedJobId = null;
  }
  openModal(jobId: string): void {
    this.selectedJobId = jobId;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedJobId = null;
  }

  filterTable(): void {
    const filteredJobs = this.jobs.filter((job) =>
      this.columns.some((column) => {
        const key = column.key as keyof Job;
        return job[key]
          ?.toString()
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      })
    );
    this.totalPages = Math.ceil(filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData(filteredJobs);
  }
  openDeleteModal(job: Job): void {
    this.selectedJobId = job.id ?? null;
    this.selectedJobTitle = job.title ?? 'this job';
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedJobId = null;
    this.selectedJobTitle = null;
  }

  confirmDelete(): void {
    if (!this.selectedJobId) return;

    this.jobRequestService.deleteJob(this.selectedJobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter((job) => job.id !== this.selectedJobId);
        this.updatePaginatedData();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        this.closeDeleteModal();
      },
    });
  }
  getSortIconPath(key: string): string {
    if (this.sortKey === key) {
      return this.sortDirection === 'asc'
        ? 'M5 15l7-7 7 7'
        : 'M19 9l-7 7-7-7';
    }
    return 'M7 11h10M7 15h10';
  }
  updatePaginatedData(filteredJobs: Job[] = this.jobs): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = filteredJobs.slice(startIndex, endIndex);
  }

  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePaginatedData();
    }
  }
  searchJobs() {

    this.paginatedData = this.jobs.filter((job) =>
      job.title?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(this.paginatedData.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editJob(id: string) {

    console.log('Editing job with id:', id);
  }

  sortTable(key: string): void {
    if (!(key in this.jobDetails)) {
      console.error(`Invalid sorting key: ${key}`);
      return;
    }
    this.sortDirection =
      this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;

    const sortedJobs = [...this.jobs].sort((a, b) => {
      const keyA = key as keyof Job;
      const valueA = a[keyA]?.toString().toLowerCase() || '';
      const valueB = b[keyA]?.toString().toLowerCase() || '';
      if (this.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    this.jobs = sortedJobs;
    this.updatePaginatedData();
  }
  fetchJobTableData(employerId: string): void {
    this.jobRequestService.getJobsByEmployerId(employerId).subscribe({
      next: (data: Job[]) => {
        this.jobs = data.sort((a, b) => {
          const idA = a.id ?? '';
          const idB = b.id ?? '';
          return idB.localeCompare(idA);
        });

        this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching job data:', err);
        this.errorMessage = 'Error fetching job data';
        this.isLoading = false;
      },
    });
  }


  deleteJob(id: string): void {
    this.jobRequestService.deleteJob(id).subscribe({
      next: () => {
        this.jobs = this.jobs.filter((job) => job.id !== id);
        this.updatePaginatedData();
        this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        this.errorMessage = 'Error deleting job';
      },
    });
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.jobs.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
  openDialog(): void {
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.resetForm();
  }

  onSelectCategory(category: string): void {
    this.selectedCategory = category;
    this.subcategories = this.allCategories[category] || [];
    console.log('Selected Category:', category);
    console.log('Subcategories:', this.subcategories);
  }

  submitForm(): void {

    if (!this.jobDetails.title || this.jobDetails.numEmployees <= 0) {
      console.error('Title and number of employees are required.');
      return;
    }


    const jobRequest: Job = {
      ...this.jobDetails,
    };

    this.jobRequestService.saveJobData(jobRequest).subscribe({
      next: (response) => {
        console.log('Job Request Submitted Successfully:', response);
        this.jobRequested = true;
        this.closeDialog();
      },
      error: (err) => {
        console.error('Failed to submit job request:', err);
      },
    });
  }

  resetForm(): void {
    this.selectedCategory = '';
    this.subcategories = [];
    this.jobDetails = {
      id: '',
      employerId: this.userId,
      job: '',
      title: '',
      numEmployees: 0,
      level: '',
      location: '',
      typeOfJob: '',
      supervisorName: '',
      supervisorPosition: '',
      supervisorEmail: '',
      supervisorPhone: '',
      status: '',
    };
  }
}
