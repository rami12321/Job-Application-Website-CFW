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
