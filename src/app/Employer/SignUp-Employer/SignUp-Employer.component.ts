import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Employer } from '../../Model/Employer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import {EmployerService} from '../../Services/employer-service/employer-services.service';
import SignaturePad from 'signature_pad';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VerificationCodeService } from '../../Services/VerificationCode/verification-code.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-SignUp-Employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, HttpClientModule,FormsModule,
  ],

  templateUrl: './SignUp-Employer.component.html',
  styleUrls: ['./SignUp-Employer.component.css']
})
export class SignUpEmployerComponent implements AfterViewInit  {
  signupForm: FormGroup;
  allUsersData: Employer[] = [];
  formSubmitted = false;
  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  verificationCode: string = '';
  active=true

  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  constructor(private fb: FormBuilder, private employerService: EmployerService, private http: HttpClient, private verificationCodeService: VerificationCodeService,
  ) {
    this.signupForm = this.fb.group(
      {
        verificationCode: ['', Validators.required],

        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        organization: ['', Validators.required],

        fullNameEnglish: ['', Validators.required],
        fullNameArabic: ['', Validators.required],
        mobilePhone: ['', [Validators.required, Validators.pattern('961\\d{8}')]],
        whatsappNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        area: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }
  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);

  }
  debugVerificationCode(): void {
    console.log('Verification Code:', this.verificationCode);
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control?.hasError(errorCode) && (control.dirty || control.touched || false);

  }
  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { 'passwordsMismatch': true };
  }


  openSignaturePad(): void {
    this.isSignatureModalOpen = true;
    setTimeout(() => {
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
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
  }

  deleteSignature(): void {
    this.signatureImage = null;
  }

  createSignupModel(): Employer {
    return {
active:this.active,
      id: this.generateUniqueId(),
      username: this.signupForm.value.email,
      password: this.signupForm.value.password,
      organization: this.signupForm.value.organization,
      fullNameEnglish: this.signupForm.value.fullNameEnglish,
      fullNameArabic: this.signupForm.value.fullNameArabic,
      mobilePhone: this.signupForm.value.mobilePhone,
      whatsappNumber: this.signupForm.value.whatsappNumber,
      email: this.signupForm.value.email,
      area: this.signupForm.value.area,
      signature: this.signatureImage || null,
      role: 'Employer'

    };
  }
  generateUniqueId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${randomLetter}-${randomNumber}`;
  }
  onSubmit(): void {
    // if (this.signupForm.invalid) {
    //   alert('Form is invalid. Please check the inputs.');
    //   return;
    // }

    const verificationCode = this.signupForm.get('verificationCode')?.value.trim();

    if (!verificationCode) {
      alert('Please enter a verification code.');
      return;
    }

    // Check if the verification code exists
    this.verificationCodeService.getCodes().subscribe(
      (codes) => {
        const matchingCode = codes.find((item) => item.code === verificationCode);

        if (matchingCode) {
          // Proceed with signup if the code is valid
          // Create the signup data, which will include the signature image
          const signupData = this.createSignupModel(); // This already includes the signatureImage

          this.employerService.saveEmployerData(signupData).subscribe(
            (response) => {
              alert('Form data saved successfully!');
              console.log('Saved successfully:', response);

              // Delete the used verification code
              this.verificationCodeService.deleteCode(verificationCode).subscribe(
                () => console.log('Verification code deleted.'),
                (err) => console.error('Error deleting verification code:', err)
              );
            },
            (error) => {
              console.error('Error saving data:', error);
              alert('Error saving form data.');
            }
          );
        } else {
          alert('Invalid verification code. Please try again.');
        }
      },
      (error) => {
        console.error('Error fetching verification codes:', error);
        alert('Error verifying the verification code.');
      }
    );

    }
  ngOnInit() {
  }





}
