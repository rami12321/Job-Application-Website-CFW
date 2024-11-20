import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-youth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './SignUp-Youth.component.html',
  styleUrls: ['./SignUp-Youth.component.css']
})
export class SignUpYouthComponent implements OnInit {
  introForm: FormGroup;
  personalInfoForm: FormGroup;
  generalForm: FormGroup;
  generalQuestionsForm: FormGroup;
  experienceDetailsForm: FormGroup;
  requiredDocumentsForm: FormGroup;
  step: number = 1;

  // Labels for stepper navigation
  stepLabels: string[] = [
    "Introduction",
    "Personal Info",
    "General Section",
    "General Questions",
    "Experience Details",
    "Required Documents"
  ];

  constructor(private fb: FormBuilder) {
    // Initialize all forms with validation rules
    this.introForm = this.fb.group({
      confirm: ['', Validators.required]
    });

    this.personalInfoForm = this.fb.group({
      firstNameEn: ['', Validators.required],
      fatherNameEn: ['', Validators.required],
      lastNameEn: ['', Validators.required],
      firstNameAr: ['', Validators.required],
      fatherNameAr: ['', Validators.required],
      lastNameAr: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(30)]],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      registrationStatus: ['', Validators.required],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^961\d{8}$/)]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^961\d{8}$/)]],
      emergencyRelation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      area: ['', Validators.required],
      fullAddress: ['', Validators.required],
      
    });
  

    this.generalForm = this.fb.group({
      generalInfo: ['', Validators.required]
    });

    this.generalQuestionsForm = this.fb.group({
      question1: ['', Validators.required],
      question2: ['', Validators.required]
    });

    this.experienceDetailsForm = this.fb.group({
      experience: ['', Validators.required]
    });

    this.requiredDocumentsForm = this.fb.group({
      document: ['', Validators.required]
    });
  }
 
  


  // Check if the current step's form is valid
  isStepValid(): boolean {
    switch (this.step) {
      case 1:
        return this.introForm.valid && this.introForm.get('confirm')?.value === 'yes';
      case 2:
        return this.personalInfoForm.valid;
      case 3:
        return this.generalForm.valid;
      case 4:
        return this.generalQuestionsForm.valid;
      case 5:
        return this.experienceDetailsForm.valid;
      case 6:
        return this.requiredDocumentsForm.valid;
      default:
        return false;
    }
  }

  // Navigate to the next step
  nextStep(): void {
    if (this.isStepValid() && this.step < this.stepLabels.length) {
      this.step++;
    }
  }

  // Navigate to the previous step
  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }
      // Utility method to easily check form errors in the template
  // Custom validator to check age range
  ageRangeValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Don't validate empty value (it will be caught by `required` validator)
      }
      const age = Number(value);
      if (isNaN(age) || age < min || age > max) {
        return { invalidAge: true }; // Error key
      }
      return null; // Valid
    };
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.personalInfoForm.get(controlName);
    return !!control?.hasError(errorCode) && (control.dirty || control.touched || false);
  }
  
  ngOnInit(): void {}
}
