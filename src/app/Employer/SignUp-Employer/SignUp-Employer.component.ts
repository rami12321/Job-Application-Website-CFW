import { Component, OnInit } from '@angular/core';
import { Employer } from '../../Model/Employer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-SignUp-Employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule],
  templateUrl: './SignUp-Employer.component.html',
  styleUrls: ['./SignUp-Employer.component.css']
})
export class SignUpEmployerComponent implements OnInit {
  signupForm: FormGroup;
  allUsersData: Employer[] = [];
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        id: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        organization: ['', Validators.required],
        fullNameEnglish: ['', Validators.required],
        fullNameArabic: ['', Validators.required],
        mobilePhone: ['', [Validators.required, Validators.pattern('961\\d{8}')]],
        whatsappNumber: ['', Validators.required],
        email: ['', Validators.email],
        area: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
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

  saveToJson(): void {
    const signupData = this.createSignupModel();
    this.allUsersData.push(signupData);

    const json = JSON.stringify(this.allUsersData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
    this.formSubmitted = true;

    setTimeout(() => {
      this.formSubmitted = false;
    }, 3000);
  }

  createSignupModel(): Employer {
    return {
      id: this.signupForm.value.id,
      password: this.signupForm.value.password,
      confirmPassword: this.signupForm.value.confirmPassword,
      organization: this.signupForm.value.organization,
      fullNameEnglish: this.signupForm.value.fullNameEnglish,
      fullNameArabic: this.signupForm.value.fullNameArabic,
      mobilePhone: this.signupForm.value.mobilePhone,
      whatsappNumber: this.signupForm.value.whatsappNumber,
      email: this.signupForm.value.email,
      area: this.signupForm.value.area,
    };
  }

  onSubmit(): void {
      const signupData = this.createSignupModel();

      // Simulate an HTTP submission
      console.log('Submitting Form Data:', signupData);
      alert('Form data submitted successfully!');
      this.saveToJson();
    }
  ngOnInit() {
  }

}
