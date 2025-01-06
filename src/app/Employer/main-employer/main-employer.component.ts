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
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-employer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    JobRequestDetailsComponent,
    JobRequestComponent,
    TabViewModule,

  ],
  templateUrl: './main-employer.component.html',
  styleUrls: ['./main-employer.component.css'],
})
export class MainEmployerComponent {
  organizationName: string = ''; // To store organization name
  displayDialog: boolean = false;
  mainCategories: any[] = [];
  selectedCategory: string = '';
  selectedjob: string = '';
  selectedArea:string='';
  selectedCampOption:string='';
  selectedCampType:string='';
  step1: boolean = false;
  jobRequested: boolean = false;
  subcategories: string[] = [];
  allCategories: Record<string, string[]> = {};
  isDeleteModalOpen = false;
  selectedJobTitle: string | null = null;
  waitingSearchQuery: string = '';
  assignedSearchQuery: string = '';
  inProgressSearchQuery: string = '';
  areaOptions: string[] = [];
  campTypeOptions: string[] = [];
  campOptions: string[] = [];
  completedSearchQuery: string = '';
  userId = localStorage.getItem('userId') || '';

  columns: { key: keyof Job; label: string }[] = [
    { key: 'jobId', label: 'JobId' },
    { key: 'job', label: 'Job' },

    { key: 'title', label: 'Job Title' },

    { key: 'location', label: 'Location' },
    { key: 'numEmployees', label: 'Number Requested' },
  ];
  waitingJobs: Job[] = [];
  assignedJobs: Job[] = [];
  inProgressJobs: Job[] = [];
  completedJobs: Job[] = [];
  filteredWaitingJobs: Job[] = [];
  filteredAssignedJobs: Job[] = [];
  filteredInProgressJobs: Job[] = [];
  filteredCompletedJobs: Job[] = [];
  paginatedWaitingJobs: Job[] = [];
  Math = Math;
paginatedAssignedJobs: Job[] = [];
paginatedInProgressJobs: Job[] = [];
paginatedCompletedJobs: Job[] = [];
  jobs: Job[] = [];
  paginatedData: Job[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = true;
  selectedJobId: string | null = null;
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedJob: Job | null = null;
  errorMessage: string | null = null;
  currentPageWaiting = 1;
currentPageAssigned = 1;
currentPageInProgress = 1;
currentPageCompleted = 1;
  jobDetails: Job = {
    jobId: '',
    employerId: this.userId,
    job: '',
    title: '',
    organizationName:this.organizationName,
    numEmployees: 0,
    level: '',
    area:'',
    campType: '',
    camp: '',
    location: '',
    typeOfJob: '',
    supervisorName: '',
    supervisorPosition: '',
    supervisorEmail: '',
    supervisorPhone: '',
    status: 'waiting-E',
  };
  userName: string = '';
  lookupData: any = {};
  areaData: any = {};

  constructor(
    private lookupService: LookupService,
    private jobRequestService: JobRequestService,
    private employerservice: EmployerService
  ) { }

  ngOnInit(): void {
    this.lookupService.getLookupData().subscribe(
      (data) => {
        this.lookupData = data;
        this.areaOptions = this.lookupData.areas.map((area: any) => area.name);


        console.log('Lookup data loaded:', this.lookupData);
        console.log('Area option:', this.areaOptions);
      },
      (error) => {
        console.error('Error loading lookup data:', error);
      });


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
    if (employerId !== null) {
      this.employerservice.getEmployerById(employerId).subscribe(
        (response) => {
          this.userName = response.fullNameEnglish || 'Unknown'; // Youth's name
        })};
    if (!employerId) {
      console.error('Employer ID not found in localStorage');
      this.errorMessage = 'You must be logged in to view this data';
      return;

    }
    // Fetch organization name by employerId
    this.employerservice.getOrganizationNameById(employerId).subscribe({
      next: (response) => {
        this.organizationName = response.organizationName || 'Unknown Organization';
        console.log('Organization Name:', this.organizationName);
      },
      error: (err) => {
        console.error('Error fetching organization name:', err);
      }
    });



    this.fetchJobTableData(employerId);
    this.totalPages = Math.ceil(this.filteredAssignedJobs.length / this.itemsPerPage);


  }
  onAreaChange(area: string): void {
    console.log('Selected Area:', area);
    this.selectedArea=area
    const Area = this.lookupData.areas.find((a: any) => a.name === area);
    if (Area) {
      this.campTypeOptions = Area.options;
      this.campOptions = []; // Clear camps until a camp type is selected
    } else {
      this.campTypeOptions = [];
      this.campOptions = [];
    }
    console.log('Camp Type Options:', this.campTypeOptions);
  }


  onCampTypeChange(selectedCampType: string): void {
    const area = this.lookupData.areas.find((a: any) => a.name === this.selectedArea);
    console.log('area',area)
    if (area) {
      if (selectedCampType === 'Inside Camp') {
        this.campOptions = area.camps;
      } else {
        this.campOptions = []; // Outside camp might have no predefined camps
      }
    } else {
      this.campOptions = [];
    }
  }


  onTabChange(event: any): void {
    const statusMap = ['waiting-E', 'assigned', 'in-progress', 'completed'];
    const selectedStatus = statusMap[event.index];

    this.paginatedData = this.jobsByStatus(selectedStatus);
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.paginatedData.length / this.itemsPerPage);
    this.updatePaginatedData('waiting');
    this.updatePaginatedData('assigned');
    this.updatePaginatedData('inProgress');
    this.updatePaginatedData('completed');
      }

  jobsByStatus(status: string): Job[] {
    return this.jobs.filter((job) => job.status === status);
  }

  categorizeJobs(): void {
    this.waitingJobs = this.jobs.filter((job) => job.status === 'waiting-E');
    this.assignedJobs = this.jobs.filter((job) => job.status === 'assigned');
    this.inProgressJobs = this.jobs.filter((job) => job.status === 'in-progress');
    this.completedJobs = this.jobs.filter((job) => job.status === 'completed');

    // Initialize filtered jobs
    this.filteredWaitingJobs = [...this.waitingJobs];
    this.filteredAssignedJobs = [...this.assignedJobs];
    this.filteredInProgressJobs = [...this.inProgressJobs];
    this.filteredCompletedJobs = [...this.completedJobs];

    // Initialize paginated data
    this.updatePaginatedData('waiting');
    this.updatePaginatedData('assigned');
    this.updatePaginatedData('inProgress');
    this.updatePaginatedData('completed');
  }

updatePaginatedData(category: string): void {
  let filteredJobs: Job[] = [];
  let currentPage = 1;
  switch (category) {
    case 'waiting':
      filteredJobs = this.filteredWaitingJobs;
      currentPage = this.currentPageWaiting;
      this.paginatedWaitingJobs = this.paginate(filteredJobs, currentPage);
      break;
    case 'assigned':
      filteredJobs = this.filteredAssignedJobs;
      currentPage = this.currentPageAssigned;
      this.paginatedAssignedJobs = this.paginate(filteredJobs, currentPage);
      break;
    case 'inProgress':
      filteredJobs = this.filteredInProgressJobs;
      currentPage = this.currentPageInProgress;
      this.paginatedInProgressJobs = this.paginate(filteredJobs, currentPage);
      break;
    case 'completed':
      filteredJobs = this.filteredCompletedJobs;
      currentPage = this.currentPageCompleted;
      this.paginatedCompletedJobs = this.paginate(filteredJobs, currentPage);
      break;
  }
}

paginate(jobs: Job[], currentPage: number): Job[] {
  const startIndex = (currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return jobs.slice(startIndex, endIndex);
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
    this.updatePaginatedData('waiting');
    this.updatePaginatedData('assigned');
    this.updatePaginatedData('inProgress');
    this.updatePaginatedData('completed');
      }
      fetchJobTableData(employerId: string): void {
        this.jobRequestService.getJobsByEmployerId(employerId).subscribe({
          next: (data: Job[]) => {
            // Sort by creation date (or jobId) descending
            this.jobs = data.sort((a, b) => {
              const dateA = new Date(a.createdDate ?? 0).getTime(); // Use appropriate date field
              const dateB = new Date(b.createdDate ?? 0).getTime();
              return dateB - dateA; // Newest to oldest
            });
      
            this.categorizeJobs(); // Categorize jobs after fetching
            this.paginatedData = this.jobsByStatus('waiting-E'); // Default to "waiting-E"
            this.totalPages = Math.ceil(this.paginatedData.length / this.itemsPerPage);
            this.updatePaginatedData('waiting');
            this.updatePaginatedData('assigned');
            this.updatePaginatedData('inProgress');
            this.updatePaginatedData('completed');
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error fetching job data:', err);
            this.errorMessage = 'Error fetching job data';
            this.isLoading = false;
          },
        });
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


  openDeleteModal(job: Job): void {
    this.selectedJobId = job.jobId ?? null;
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
        window.location.reload(); // Reload the page
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



  searchJobs(status: string): void {
    switch (status) {
      case 'waiting':
        this.filteredWaitingJobs = this.waitingJobs.filter((job) =>
          job.title?.toLowerCase().includes(this.waitingSearchQuery.toLowerCase())
        );
        break;
      case 'assigned':
        this.filteredAssignedJobs = this.assignedJobs.filter((job) =>
          job.title?.toLowerCase().includes(this.assignedSearchQuery.toLowerCase())
        );
        break;
      case 'in-progress':
        this.filteredInProgressJobs = this.inProgressJobs.filter((job) =>
          job.title?.toLowerCase().includes(this.inProgressSearchQuery.toLowerCase())
        );
        break;
      case 'completed':
        this.filteredCompletedJobs = this.completedJobs.filter((job) =>
          job.title?.toLowerCase().includes(this.completedSearchQuery.toLowerCase())
        );
        break;
    }
  }

  editJob(id: string) {

    console.log('Editing job with id:', id);
  }
  sortTable(key: string): void {
    if (!(key in this.jobs[0])) {
      console.error(`Invalid sorting key: ${key}`);
      return;
    }
    
    this.sortDirection =
      this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;
  
    const sortedJobs = [...this.jobs].sort((a, b) => {
      if (key === 'createdDate') {
        const dateA = new Date(a.createdDate ?? 0).getTime();
        const dateB = new Date(b.createdDate ?? 0).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = (a[key as keyof Job] as string | number | undefined)?.toString().toLowerCase() || '';
        const valueB = (b[key as keyof Job] as string | number | undefined)?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  
    this.jobs = sortedJobs;
    this.updatePaginatedData('waiting');
    this.updatePaginatedData('assigned');
    this.updatePaginatedData('inProgress');
    this.updatePaginatedData('completed');
  }
  


  deleteJob(id: string): void {
    this.jobRequestService.deleteJob(id).subscribe({
      next: () => {
        this.jobs = this.jobs.filter((job) => job.jobId !== id);
        this.updatePaginatedData('waiting');
        this.updatePaginatedData('assigned');
        this.updatePaginatedData('inProgress');
        this.updatePaginatedData('completed');
                this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        this.errorMessage = 'Error deleting job';
      },
    });
  }
  prevPage(category: string): void {
    switch (category) {
      case 'waiting':
        if (this.currentPageWaiting > 1) {
          this.currentPageWaiting--;
          this.updatePaginatedData('waiting');
        }
        break;
      case 'assigned':
        if (this.currentPageAssigned > 1) {
          this.currentPageAssigned--;
          this.updatePaginatedData('assigned');
        }
        break;
      case 'inProgress':
        if (this.currentPageInProgress > 1) {
          this.currentPageInProgress--;
          this.updatePaginatedData('inProgress');
        }
        break;
      case 'completed':
        if (this.currentPageCompleted > 1) {
          this.currentPageCompleted--;
          this.updatePaginatedData('completed');
        }
        break;
    }
  }

  nextPage(category: string): void {
    switch (category) {
      case 'waiting':
        if (this.currentPageWaiting < Math.ceil(this.filteredWaitingJobs.length / this.itemsPerPage)) {
          this.currentPageWaiting++;
          this.updatePaginatedData('waiting');
        }
        break;
      case 'assigned':
        if (this.currentPageAssigned < Math.ceil(this.filteredAssignedJobs.length / this.itemsPerPage)) {
          this.currentPageAssigned++;
          this.updatePaginatedData('assigned');
        }
        break;
      case 'inProgress':
        if (this.currentPageInProgress < Math.ceil(this.filteredInProgressJobs.length / this.itemsPerPage)) {
          this.currentPageInProgress++;
          this.updatePaginatedData('inProgress');
        }
        break;
      case 'completed':
        if (this.currentPageCompleted < Math.ceil(this.filteredCompletedJobs.length / this.itemsPerPage)) {
          this.currentPageCompleted++;
          this.updatePaginatedData('completed');
        }
        break;
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

  onSelectJob(job: string): void {
    this.selectedjob = job;
    this.step1 = true;
  }

  submitForm(): void {
    if (!this.jobDetails.title || this.jobDetails.numEmployees <= 0) {
      console.error('Title and number of employees are required.');
      return;
    }
    
  
    const jobRequest: Job = {
      ...this.jobDetails,
      job: this.selectedjob,
      category: this.selectedCategory,
      area: this.selectedArea,
      organizationName: this.organizationName,
      createdDate: new Date().toISOString(), // Ensure new job has a timestamp
    };
  
    this.jobRequestService.saveJobData(jobRequest).subscribe({
      next: (response) => {
        console.log('Job Request Submitted Successfully:', response);
        this.jobRequested = true;
        this.closeDialog();

        window.location.reload();

      },
      error: (err) => {
        console.error('Failed to submit job request:', err);
      },
    });
  }
  


  resetForm(): void {
    this.selectedCategory = '';
    this.selectedArea = '';
    this.subcategories = [];
    this.jobDetails = {
      jobId: '',
      employerId: this.userId,
      job: '',
      title: '',
      numEmployees: 0,
      organizationName:'',
      level: '',
      area:'',
      campType: '',
      camp: '',
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
