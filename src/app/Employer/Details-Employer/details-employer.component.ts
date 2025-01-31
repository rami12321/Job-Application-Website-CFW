import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { Employer } from '../../Model/Employer';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details-employer.component.html',
  styleUrl: './details-employer.component.css'
})
export class DetailsEmployerComponent implements OnInit, OnChanges {
  @Input() employerId!: string;
  public employer: Employer | undefined;
  public signatureImage: string | null = null;
  isModalOpen = false;
  modalImage: string = '';

  constructor(private employerService: EmployerService, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.employerId) {
      this.fetchEmployerDetails();
    }
  }

  ngOnChanges(): void {
    if (this.employerId) {
      this.fetchEmployerDetails();
    }
  }

  openModal(imageSrc: string): void {
    this.modalImage = imageSrc;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  private fetchEmployerDetails(): void {
    this.employerService.getEmployerById(this.employerId).subscribe({
      next: (data: Employer) => {
        this.employer = data;
        const signatureId = data?.signature?.split('#')[1] || '';
        if (signatureId) {
          this.fetchSignature(signatureId);
        } else {
          console.warn('Invalid or missing signature field');
        }
      },
      error: (err) => {
        console.error('Error fetching employer data:', err);
      }
    });
  }

  private fetchSignature(signatureId: string): void {
    this.http.get<any[]>('/assets/data/signatures.json').subscribe({
      next: (data) => {
        console.log('Signatures JSON:', data); // Debug log
        const signature = data.find(sig => sig.id === signatureId);
        if (signature) {
          this.signatureImage = signature.signatureImage;
          console.log('Signature found:', this.signatureImage); // Debug log
        } else {
          console.warn('Signature not found for ID:', signatureId);
        }
      },
      error: (err) => {
        console.error('Error fetching signatures:', err);
      }
    });
  }
}
