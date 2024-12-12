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

@Component({
  selector: 'app-main-employer',
  standalone: true,
  imports: [CommonModule, DialogModule, MultiSelectModule, DropdownModule, PaginatorModule, ButtonModule],
  templateUrl: './main-employer.component.html',
  styleUrls: ['./main-employer.component.css']
})
export class MainEmployerComponent {
  displayDialog: boolean = false;
  mainCategories: any[] = []; // Categories for dropdown
  selectedCategory: string = '';
  jobRequested: boolean = false;
  subcategories: string[] = []; // Store selected subcategories
  allCategories: Record<string, string[]> = {}; // Store full category data
 

  columns: { key: keyof Job, label: string }[] = [
    { key: 'title', label: 'Job Title' },
    { key: 'location', label: 'Location' },
    { key: 'typeOfJob', label: 'Type' },
    { key: 'supervisorName', label: 'Supervisor' }
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
errorMessage: string | null = null;
  jobDetails: Job = {
    id: '', // Optional
    title: '',
    numEmployees: 0,
    level: '',
    location: '',
    typeOfJob: '',
    supervisorName: '',
    supervisorPosition: '',
    supervisorEmail: '',
    supervisorPhone: '',
  };

  constructor(
    private lookupService: LookupService,
    private jobRequestService: JobRequestService
  ) {}

  ngOnInit(): void {
    // Fetch categories from LookupService
    this.lookupService.getJobCategories().subscribe({
      next: (data: any) => {
        if (data && data.length > 0 && data[0].categories) {
          this.mainCategories = Object.keys(data[0].categories).map(key => ({
            label: key, // Key as label
            value: key  // Key as value
          }));
          this.allCategories = data[0].categories; // Store full categories data
          console.log('Categories loaded:', this.mainCategories);
        } else {
          console.error('Unexpected category data format:', data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
    this.fetchJobTableData();
  }
  filterTable(): void {
    const filteredJobs = this.jobs.filter((job) =>
      this.columns.some((column) => {
        const key = column.key as keyof Job; // Explicitly cast to keyof Job
        return job[key]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
      })
    );
    this.totalPages = Math.ceil(filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData(filteredJobs);
  }

  getSortIconPath(key: string): string {
    if (this.sortKey === key) {
      return this.sortDirection === 'asc'
        ? 'M5 15l7-7 7 7' // Ascending arrow
        : 'M19 9l-7 7-7-7'; // Descending arrow
    }
    return 'M7 11h10M7 15h10'; // Neutral state
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
    // Perform search filter logic here based on searchQuery
    this.paginatedData = this.jobs.filter((job) =>
      job.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(this.paginatedData.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page after search
  }

  editJob(id: string) {
    // Handle editing logic here
    console.log('Editing job with id:', id);
  }

  deleteJob(id: string) {
    // Handle delete logic here
    console.log('Deleting job with id:', id);
  }

  sortTable(key: string): void {
    if (!(key in this.jobDetails)) {
      console.error(`Invalid sorting key: ${key}`);
      return;
    }
    this.sortDirection = this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
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

  fetchJobTableData(): void {
    this.jobRequestService.getAllJobs().subscribe({
      next: (data: Job[]) => {
        this.jobs = data;
        this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching job data:', err);
        this.errorMessage = 'Error fetching job data';
        this.isLoading = false;
      }
    });
    this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
    this.updatePagination();
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
    this.paginatedData = this.jobs.slice(startIndex, startIndex + this.itemsPerPage);
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
    // Validate required fields
    if (!this.jobDetails.title || this.jobDetails.numEmployees <= 0) {
      console.error('Title and number of employees are required.');
      return;
    }

    // Build job request object
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
      }
    });
  }

  resetForm(): void {
    this.selectedCategory = '';
    this.subcategories = [];
    this.jobDetails = {
      id: '',
      title: '',
      numEmployees: 0,
      level: '',
      location: '',
      typeOfJob: '',
      supervisorName: '',
      supervisorPosition: '',
      supervisorEmail: '',
      supervisorPhone: '',
    };
  }
}