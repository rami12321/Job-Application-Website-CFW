import { Component, Input, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { Job } from '../../Model/JobDetails';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';
import { LookupService } from '../../Services/LookUpService/lookup.service';

@Component({
  selector: 'app-job-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './job-request.component.html',
  styleUrls: ['./job-request.component.css']
})
export class JobRequestComponent implements OnInit {
  @Input() jobId: string | null = null;
  public jobRequest: Job | undefined;
  isEditing: { [key: string]: boolean } = {};
  editModels: { [key: string]: any } = {};
  step1: boolean = false;

  isModalOpen = false;
  modalImage: string = '';
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  isEditingSignature = false;
  mainCategories: any[] = [];
  selectedCategory: string = '';
  selectedjob: string = '';
  subcategories: string[] = [];
  allCategories: Record<string, string[]> = {};



  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute,
    private lookupService: LookupService,

  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Job ID from route:', id);
      if (id) {
        this.jobId = id;
        this.fetchJobRequestDetails();
      } else {
        console.error('No jobId found in route parameters');
      }
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
  }

  toggleEditCategory(): void {
    this.isEditing['category'] = !this.isEditing['category'];
  }


  toggleEditJob(): void {
    this.isEditing['job'] = !this.isEditing['job'];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && this.jobId) {
      this.fetchJobRequestDetails();
    }
  }


  fetchJobRequestDetails(): void {
    if (!this.jobId) {
      console.error('Job ID is not set');
      return;
    }

    this.jobRequestService.getJobById(this.jobId).subscribe({
      next: (data: Job) => {
        console.log('Fetched job request:', data);
        this.jobRequest = data;
        this.selectedCategory = data.category || '';
        this.selectedjob = data.job || '';
        this.subcategories = this.allCategories[this.selectedCategory] || [];
      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      },
    });
  }

  startEditing(): void {
    this.isEditing = {
      category: true,
      job: true,
      jobTitle: true,
      numEmployees: true,
      level: true,
      location: true,
      typeOfJob: true,
      supervisorName: true,
      supervisorPosition: true,
      supervisorEmail: true,
      supervisorPhone: true,
      details: true
    };
    this.editModels = { ...this.jobRequest };
  }

  saveChanges(): void {
    if (!this.jobId) {
      console.error('Invalid jobId');
      return;
    }

    if (!this.editModels) {
      console.error('editModels is empty or undefined');
      return;
    }



    this.editModels['category'] = this.selectedCategory;
    this.editModels['job'] = this.selectedjob;

    console.log('Saving changes...', this.editModels);

    if (this.jobRequest) {

      Object.assign(this.jobRequest, this.editModels);
      console.log('Updated jobRequest:', this.jobRequest);
    }


    this.jobRequestService.updateJob(this.jobId, this.editModels).subscribe({
      next: () => {
        console.log('Job request updated successfully');


        this.isEditing['details'] = false;


        Object.keys(this.isEditing).forEach((key) => {
          if (key !== 'details') {
            this.isEditing[key] = false;
          }
        });
      },
      error: (err) => {
        console.error('Error updating job request:', err);
      }
    });
  }

  onSelectCategory(category: string): void {
    this.selectedCategory = category;
    this.subcategories = this.allCategories[category] || [];



    this.editModels['category'] = category;
    console.log('Selected Category:', category);
    console.log('Available Subcategories:', this.subcategories);
  }

  onSelectJob(job: string): void {
    this.selectedjob = job;



    this.editModels['job'] = job;
    console.log('Selected Job:', job);
  }





  cancelEditing(): void {
    this.isEditing = {
      job: false,
      jobTitle: false,
      category: false,

      numEmployees: false,
      level: false,
      location: false,
      typeOfJob: false,
      supervisorName: false,
      supervisorPosition: false,
      supervisorEmail: false,
      supervisorPhone: false,
      details: false
    };
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
