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
import { Router } from '@angular/router';
import * as L from 'leaflet';

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
  isLoading: boolean = false;
  locationFetched = false;
  showManualMap = false;
  userLat: number | null = null;
  userLng: number | null = null;
  map: L.Map | undefined;
  manualMap: L.Map | undefined;
  manualMarker: L.Marker | undefined;
@ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  constructor(private fb: FormBuilder, private employerService: EmployerService, private http: HttpClient, private verificationCodeService: VerificationCodeService,  private router: Router

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
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }
  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    if (this.locationFetched) {
      this.loadMap();
    }

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
      role: 'Employer',
      latitude: this.signupForm.value.latitude,   // Include latitude
      longitude: this.signupForm.value.longitude 

    };
  }
  generateUniqueId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${randomLetter}-${randomNumber}`;
  }
  onSubmit(): void {
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

              // Navigate to the login page
              this.router.navigate(['/login']);
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

  getUserLocation() {
    this.isLoading = true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.isLoading = false;
          this.locationFetched = true;
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          setTimeout(() => this.loadMap(), 100); // Ensure map loads after HTML renders
        },
        (error) => {
          this.isLoading = false;
          alert('Error fetching location: ' + error.message);
        }
      );
    } else {
      this.isLoading = false;
      alert('Geolocation is not supported by your browser.');
    }
  }

  loadMap() {
    if (!this.userLat || !this.userLng) return;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([this.userLat, this.userLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.marker([this.userLat, this.userLng]).addTo(this.map)
      .bindPopup('Your location')
      .openPopup();
  }

  openLocationPopup() {
    this.showManualMap = true;
    this.locationFetched = false; // Hide the automatic map
  
    setTimeout(() => {
      // Remove any existing map instance before creating a new one
      if (this.manualMap) {
        this.manualMap.remove();
      }
  
      this.loadManualMap();
    }, 100);
  }
  
  loadManualMap() {
    if (this.manualMap) {
      this.manualMap.remove();
    }

    this.manualMap = L.map('manual-map').setView([34.5126668, 35.964311], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.manualMap);

    this.manualMap.on('click', (e: L.LeafletMouseEvent) => {
      if (this.manualMarker) {
        this.manualMarker.setLatLng(e.latlng);
      } else {
        this.manualMarker = L.marker(e.latlng).addTo(this.manualMap!);
      }
    });
  }

  confirmManualLocation() {
    if (this.manualMarker) {
      const latlng = this.manualMarker.getLatLng();
      this.userLat = latlng.lat;
      this.userLng = latlng.lng;
      this.locationFetched = true; // Show the automatic map after manual selection
      this.showManualMap = false; // Close the manual selection popup
      setTimeout(() => this.loadMap(), 100);
    } else {
      alert('Please select a location on the map.');
    }}

  closeLocationPopup() {
    this.showManualMap = false;
  }
  
  ngOnInit() {
  }





}
