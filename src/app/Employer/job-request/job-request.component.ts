import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

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

  fetchJobRequestDetails(): void {
    this.jobRequestService.getJobById(this.jobId!).subscribe({
      next: (data: Job) => {
        this.jobRequest = data;
      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      }
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

  openSignaturePad(isEditing: boolean = false): void {
    this.isEditingSignature = isEditing;
    this.isSignatureModalOpen = true;

    setTimeout(() => {
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
      if (isEditing && this.signatureImage) {
        const img = new Image();
        img.src = this.signatureImage;
        img.onload = () => {
          const canvas = this.signaturePadElement.nativeElement;
          const context = canvas.getContext('2d');
          context?.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    });
  }

  saveSignature(): void {
    if (!this.signaturePad.isEmpty()) {
      this.signatureImage = this.signaturePad.toDataURL();
      this.closeSignaturePad();
    } else {
      alert('Please provide a signature.');
    }
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  closeSignaturePad(): void {
    this.isSignatureModalOpen = false;
    this.isEditingSignature = false;
  }

  deleteSignature(): void {
    this.signatureImage = null;
  }
}
