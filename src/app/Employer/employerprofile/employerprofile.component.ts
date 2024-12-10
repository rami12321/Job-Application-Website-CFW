import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { Employer } from '../../Model/Employer';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-employerprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employerprofile.component.html',
  styleUrls: ['./employerprofile.component.css']
})
export class EmployerprofileComponent implements OnChanges {
  private userId: string | null = null;
  public employer: Employer | undefined;
  isEditing: { [key: string]: boolean } = {};
  editModels: { [key: string]: any } = {};
  isModalOpen = false;
  modalImage: string = '';
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  isEditingSignature = false; 

  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  constructor(private employerService: EmployerService,   private route: ActivatedRoute,  // Inject ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.fetchEmployerDetails(); // Fetch data when userId changes
    }
  }

  startEditing(): void {
    this.isEditing['details'] = true;
    this.editModels = { ...this.employer }; // Create a deep copy of the employer data
  }

  saveChanges(): void {
    if (!this.editModels) return;

    if (this.employer) {
      Object.assign(this.employer, this.editModels);
    }

    this.employerService.updateEmployer(this.userId!, this.editModels).subscribe({
      next: () => {
        console.log(`Employer details updated successfully`);
        this.isEditing['details'] = false;
      },
      error: (err) => {
        console.error(`Error updating employer details:`, err);
      },
    });
  }

  cancelEditing(): void {
    this.isEditing['details'] = false;
    this.editModels = {}; 
  }

  private fetchEmployerDetails(): void {
    this.employerService.getEmployerById(this.userId!).subscribe({
      next: (data: Employer) => {
        this.employer = data; // Store the employer details
      },
      error: (err) => {
        console.error('Error fetching employer data:', err);
      },
    });
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
    this.signatureImage = this.signaturePad.toDataURL(); // Save as Base64
    console.log('Signature saved:', this.signatureImage); // Check signature data
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
  this.isEditingSignature = false; // Reset editing state
}

deleteSignature(): void {
  this.signatureImage = null;
}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Route params:', params); // Log the entire paramMap
      console.log('Retrieved id:', id); // Log the value of the id
  
      this.userId = id ? id : null;  // Store it directly as a string
  
      console.log('userId:', this.userId);
  
      if (this.userId) {
        this.fetchEmployerDetails();
      } else {
        console.error('Invalid or missing id');
      }
    });

  }
  
  
  
}
