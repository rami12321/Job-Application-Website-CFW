import { Component, Input, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { Job } from '../../Model/JobDetails';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';

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
  isModalOpen = false;
  modalImage: string = '';
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  isEditingSignature = false;


  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobId = id;
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
        this.jobRequest = data;
      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      }
    });
  }
  startEditing(): void {
    this.isEditing = {
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
      console.error('Invalid or missing jobId');
      return;  // Prevent the save action if jobId is invalid
    }
  
    if (!this.editModels) return;
  
    if (this.jobRequest) {
      Object.assign(this.jobRequest, this.editModels);
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
  



  cancelEditing(): void {
    this.isEditing = {
      jobTitle: false,
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
