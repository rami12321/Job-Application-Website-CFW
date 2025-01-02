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
  profileImageSrc: string | null = null;

  isEditing: { [key: string]: boolean } = {};
  editModels: { [key: string]: any } = {};
  isModalOpen = false;
  modalImage: string = '';
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  isEditingSignature = false;
  public signatureSrc: string | null = null;

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
  private loadSignature(signatureId: string): void {
    fetch('/assets/data/signatures.json')
      .then((response) => response.json())
      .then((signatures) => {
        const signatureEntry = signatures.find((sig: any) => sig.id === signatureId);
        if (signatureEntry) {
          this.employer!.signature = signatureEntry.signatureImage; // Set Base64 data
        } else {
          console.error('Signature not found in signatures.json for ID:', signatureId);
        }
      })
      .catch((error) => {
        console.error('Error fetching signatures.json:', error);
      });
  }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageSrc = reader.result as string; // Update preview dynamically
      };
      reader.readAsDataURL(file); // Convert file to Base64 string
    }
  }


  convertImageToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string; // This is the base64 string

      // Send base64 string to backend
      this.uploadImageAsBase64(base64String);
    };

    reader.readAsDataURL(file);  // Converts the file to base64
  }

  uploadImageAsBase64(base64String: string): void {
    const payload = { image: base64String };

    this.employerService.uploadProfileImage(this.userId!, payload).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:', response);

        // Store only the key in employer's profileImage
        this.employer!.profileImage = response.imageUrl; // This should be just the key or URL

        // Call to update profile image
        this.getProfileImage();
      },
      error: (err) => {
        console.error('Error uploading image:', err);
      },
    });
  }

// Method to get the profile image from images.json based on employer's profileImage key
getProfileImage(): void {
  const imageKey = this.employer?.profileImage?.split('#')[1];  // Extract key part from profileImage string

  if (imageKey) {
    fetch('/assets/data/images.json')  // This assumes images.json is in the assets folder
      .then((response) => response.json())
      .then((images) => {
        const imageEntry = images.find((img: any) => img.key === imageKey);
        if (imageEntry) {
          this.profileImageSrc = imageEntry.data;  // Assign base64 string from images.json
        }
      })
      .catch((error) => {
        console.error('Error fetching images.json:', error);
      });
  }
  // If no profile image key is available, set profileImageSrc to null or a default image URL
  else {
    this.profileImageSrc = null;  // Or use a default image URL
  }
}


  cancelEditing(): void {
    this.isEditing['details'] = false;
    this.editModels = {};
  }
  private fetchEmployerDetails(): void {
    this.employerService.getEmployerById(this.userId!).subscribe({
      next: (data: Employer) => {
        this.employer = data;
 // After employer data is fetched, load the profile image
      },
      error: (err) => {
        console.error('Error fetching employer data:', err);
      },
    });
  }

  private loadProfileImage(): void {
    const imageKey = this.employer?.profileImage?.split('#')[1]; // Extract the image key
    if (imageKey) {
      fetch('/assets/data/images.json')
        .then((response) => response.json())
        .then((images) => {
          const imageEntry = images.find((img: any) => img.key === imageKey);
          if (imageEntry) {
            this.profileImageSrc = imageEntry.data; // Assign Base64 or URL from images.json
          } else {
            console.error('Image not found in images.json for key:', imageKey);
            this.profileImageSrc = null; // Fallback if no image is found
          }
        })
        .catch((error) => {
          console.error('Error fetching images.json:', error);
          this.profileImageSrc = null; // Handle fetch error
        });
    } else {
      this.profileImageSrc = null; // Fallback if no key is present
    }
  }





  openModal(imageSrc: string): void {
    this.modalImage = imageSrc; // Assign Base64 or URL of the signature
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
    this.getProfileImage();


  }



}
