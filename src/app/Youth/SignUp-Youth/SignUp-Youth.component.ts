import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import {  YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { Youth} from '../../Model/Youth';
import { PasswordModule } from 'primeng/password';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-sign-up-youth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,PasswordModule,StepperModule, ButtonModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

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
  formSubmitted: boolean = false;
  showPatternError = false; // Controls when to display the pattern error

  private areaData: any;

  lookupData: any = {};

  step: number = 1;
  areaOptions: string[] = [];
  campTypeOptions: string[] = [];
  campOptions: string[] = [];
  majors: string[] = [];
  allUsersData: any[] = [];

  trainingsAndSkillsForm: FormGroup;

  stepLabels: string[] = [
    'Introduction',
    'Personal Info',
    'General Section',
    'General Questions',
    'Experience Details',
    'Trainings and Skills',
    'Required Documents',

  ];
  skills: any;
  computerSkillsOptions: any;
  skillOptions: any;
  selectedStatus: string = '';
  jobOpportunityOptions: string[] = [];
  educationLevels: string[] = [];
  additionalQuestions: any[] = [];

  constructor(private fb: FormBuilder,
    private youthService: YouthServiceService,
    private lookupService: LookupService,
    private http: HttpClient
  ) {
    this.introForm = this.fb.group({
      confirm: ['', Validators.required],
    });

    this.personalInfoForm = this.fb.group({
      firstNameEn: ['', Validators.required],
      fatherNameEn: ['', Validators.required],
      lastNameEn: ['', Validators.required],
      firstNameAr: ['', Validators.required],
      fatherNameAr: ['', Validators.required],
      lastNameAr: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', [Validators.required, this.ageRangeValidator(18, 30)]],
      nationality: ['', Validators.required],
      registrationStatus: ['', Validators.required],
      familyRegistrationNumber: [
        '',
        [Validators.pattern(/^1-\d{8}$/)] 
      ],
      personalRegistrationNumber: [
        '',
        [Validators.required, Validators.pattern(/^2-\d{8}$/)],
        [this.registrationNumberValidator.bind(this)] 
      ],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^961\d{8}$/)]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^961\d{8}$/)]],
      emergencyRelation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      area: ['', Validators.required],
      fullAddress: ['', Validators.required],
      headfa: [''],
      campType: ['', Validators.required],
      camp: ['', Validators.required],
    });
    this.additionalQuestions = [
      {
        label: 'Are you a volunteer with Palestinian Red Crescent Society (PRCS)?',
        controlName: 'isPrcsVolunteer',
        includePreferNotToState: false,
      },
      {
        label: 'Are you a volunteer with the Palestinian Fire Brigades Lebanese Camps?',
        controlName: 'isFireBrigadesVolunteer',
        includePreferNotToState: false,
      },
      {
        label: 'Are you a volunteer with Al-Shifaa for Medical & Humanitarian Services?',
        controlName: 'isAlShifaaVolunteer',
        includePreferNotToState: false,
      },
    ];


    this.generalForm = this.fb.group({
      jobOpportunitySource: ['', Validators.required],
      educationGraduate: ['', Validators.required],
      educationLevel: ['', Validators.required],
      major: ['', Validators.required],
      institution: ['', Validators.required],
      graduationDate: ['', Validators.required],
      gradplace: ['', Validators.required],
      employmentOpportunities: ['', Validators.required],
      aboutYourself: ['', Validators.required],
    });


    this.generalQuestionsForm = this.fb.group({
      placedByKfw: ['', Validators.required],
      kfwYear: [''],
      question2 : ['', Validators.required],

      innovationLabGraduate: ['', Validators.required],
      innovationLabGradtype: this.fb.array([]),



      disability: ['', Validators.required],
      disabilitySupport: [''],
      disabilityTypes: this.fb.array([]),


      employed: ['', Validators.required],
      seekingEmploymentDuration: [''],

      isPrcsVolunteer: ['', Validators.required],
      isFireBrigadesVolunteer: ['', Validators.required],
      isAlShifaaVolunteer: ['', Validators.required],
    });





    this.experienceDetailsForm = this.fb.group({
      experiences: this.fb.array([this.createExperience()])
    });


    this.trainingsAndSkillsForm = this.fb.group({
      trainings: this.fb.array([]),

      skills: this.fb.group({
        arabic: ['', Validators.required],
        english: ['', Validators.required],
        french: ['', Validators.required],
        computerSkills: this.fb.array([]) 

      }),
    });





    this.requiredDocumentsForm = this.fb.group({
      cv: ['', Validators.required],
      coverLetter: [''],
      identityCard: ['', Validators.required],
      registrationCard: ['', Validators.required],
      degree: ['', Validators.required],
      prcsProof: ['', this.isPrcsVolunteer() ? Validators.required : []],
      fireProof: ['', this.isFireBrigadesVolunteer() ? Validators.required : []],
      alShifaaProof: ['', this.isAlShifaaVolunteer() ? Validators.required : []],
      confirmation: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      
        },{ validators: this.passwordsMatch });



    this.areaData = this.lookupService.getAreaData();
  }

  ngOnInit(): void {
    this.lookupService.getLookupData().subscribe(
      (data) => {
        this.lookupData = data;
        this.areaOptions = this.lookupData.areas.map((area: any) => area.name); 


        console.log('Lookup data loaded:', this.lookupData); // Debugging log
      },
      (error) => {
        console.error('Error loading lookup data:', error);
      });

    this.lookupService.fetchAreaData().subscribe((data) => {
      this.lookupService.setAreaData(data);
      this.areaData = this.lookupService.getAreaData();
      this.areaOptions = this.lookupService.getAreaOptions();
    });


    this.lookupService.getMajors().subscribe((data) => {
      this.majors = data;
    });


    this.onChanges();
    this.setupDynamicValidation();


  }
  
  private setupDynamicValidation() {
    this.generalQuestionsForm.get('placedByKfw')?.valueChanges.subscribe((value) => {
      const kfwYearControl = this.generalQuestionsForm.get('kfwYear');
      if (value === 'yes') {
        kfwYearControl?.setValidators([Validators.required]);
      } else {
        kfwYearControl?.clearValidators();
      }
      kfwYearControl?.updateValueAndValidity();
    });

    this.generalQuestionsForm.get('innovationLabGraduate')?.valueChanges.subscribe((value) => {
      const socialEntrepreneurshipControl = this.generalQuestionsForm.get('socialEntrepreneurship');
      const digitalSkillsControl = this.generalQuestionsForm.get('digitalSkills');
      if (value === 'yes') {
        socialEntrepreneurshipControl?.setValidators([Validators.requiredTrue]);
        digitalSkillsControl?.setValidators([Validators.requiredTrue]);
      } else {
        socialEntrepreneurshipControl?.clearValidators();
        digitalSkillsControl?.clearValidators();
      }
      socialEntrepreneurshipControl?.updateValueAndValidity();
      digitalSkillsControl?.updateValueAndValidity();
    });

    this.generalQuestionsForm.get('disability')?.valueChanges.subscribe((value) => {
      const disabilitySupportControl = this.generalQuestionsForm.get('disabilitySupport');
      const disabilityTypesControl = this.generalQuestionsForm.get('disabilityTypes') as FormGroup;
      if (value === 'yes') {
        disabilitySupportControl?.setValidators([Validators.required]);
        Object.keys(disabilityTypesControl.controls).forEach((type) => {
          disabilityTypesControl.get(type)?.setValidators([Validators.requiredTrue]);
        });
      } else {
        disabilitySupportControl?.clearValidators();
        Object.keys(disabilityTypesControl.controls).forEach((type) => {
          disabilityTypesControl.get(type)?.clearValidators();
        });
      }
      disabilitySupportControl?.updateValueAndValidity();
      Object.keys(disabilityTypesControl.controls).forEach((type) => {
        disabilityTypesControl.get(type)?.updateValueAndValidity();
      });
    });
    this.personalInfoForm
      .get('personalRegistrationNumber')
      ?.valueChanges.pipe(debounceTime(400)) // Wait 300ms after user stops typing
      .subscribe(() => {
        this.updatePatternError();
      });
    this.generalQuestionsForm.get('employed')?.valueChanges.subscribe((value) => {
      const seekingEmploymentDurationControl = this.generalQuestionsForm.get('seekingEmploymentDuration');
      if (value === 'no') {
        seekingEmploymentDurationControl?.setValidators([Validators.required]);
      } else {
        seekingEmploymentDurationControl?.clearValidators();
      }
      seekingEmploymentDurationControl?.updateValueAndValidity();
    });
  }
  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    // Return error if passwords don't match
    return password && confirmPassword && password === confirmPassword ? null : { 'passwordsMismatch': true };
  }
  
  

  ageRangeValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (isNaN(age) || age < min || age > max) {
        return { invalidAge: true };
      }
      return null;
    };
  }
  get experiences(): FormArray<FormGroup> {
    return this.experienceDetailsForm.get('experiences') as FormArray<FormGroup>;
  }
  get trainings(): FormArray<FormGroup> {
    return this.trainingsAndSkillsForm.get('trainings') as FormArray<FormGroup>;
  }

  registrationNumberValidator(control: AbstractControl) {
    const value = control.value;
  
    // Check format before querying the database
    if (!value || !/^2-\d{8}$/.test(value)) {
      return of(null); // Return valid if the format is incorrect
    }
  
    return this.youthService.getAllYouth().pipe(
      switchMap((data) => {
        const isTaken = data.some(
          (entry) => entry.personalRegistrationNumber === value
        );
        return of(isTaken ? { alreadyExists: true } : null);
      }),
      catchError(() => of(null)) // Handle errors gracefully
    );
  }
  onChanges(): void {
    this.personalInfoForm.get('area')?.valueChanges.subscribe((selectedArea) => {
      if (selectedArea) {
        const selectedAreaData = this.lookupData.areas.find((area: any) => area.name === selectedArea);
  
        this.campTypeOptions = selectedAreaData ? selectedAreaData.options : [];
        this.campOptions = [];
        this.personalInfoForm.get('campType')?.reset();
        this.personalInfoForm.get('camp')?.reset();
      } else {
        this.campTypeOptions = [];
        this.campOptions = [];
      }
    });
  
    this.personalInfoForm.get('campType')?.valueChanges.subscribe((selectedType) => {
      if (selectedType === 'Inside Camp') {
        const selectedArea = this.personalInfoForm.get('area')?.value;
  
        const selectedAreaData = this.lookupData.areas.find((area: any) => area.name === selectedArea);
        this.campOptions = selectedAreaData ? selectedAreaData.camps : [];
      } else {
        this.campOptions = [];
        this.personalInfoForm.get('camp')?.reset();
      }
    });
  
  
  }
  addTraining(): void {
    const trainingGroup = this.fb.group({
      institution: ['', Validators.required],
      certificate: ['', Validators.required],
      area: ['', Validators.required],
      durationFrom: ['', Validators.required],
      durationTo: ['', Validators.required],
    });

    this.trainings.push(trainingGroup);
  }

  removeTraining(index: number): void {
    this.trainings.removeAt(index);
  }

  finishTraining() {
    console.log('Finished adding training profiles');
  }


  get skillsForm(): FormGroup {
    return this.trainingsAndSkillsForm.get('skills') as FormGroup;
  }
  

  createExperience(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      employerName: [''],
      employerPhone: ['', [Validators.pattern(/^\d{11}$/)]],
      area: [''],
      employmentType: [''],
      jobTitle: [''],
      startDate: [''],
      endDate: [''],
      salary: [''],
      tasks: ['']
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperience());
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  onExperienceTypeChange(index: number): void {
    const experience = this.experiences.at(index);
    if (experience.get('type')?.value === 'None') {
      experience.reset({ type: 'None' });
    }
  }
  finishExperience(): void {
    console.log('All experiences:', this.experienceDetailsForm.value);
  }

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
        return this.trainingsAndSkillsForm.valid;
      case 7:
        return this.requiredDocumentsForm.valid;
      default:
        return false;
    }
  }
  isPrcsVolunteer(): boolean {
    return this.generalQuestionsForm.get('isPrcsVolunteer')?.value === 'yes';
  }

  isFireBrigadesVolunteer(): boolean {
    return this.generalQuestionsForm.get('isFireBrigadesVolunteer')?.value === 'yes';
  }

  isAlShifaaVolunteer(): boolean {
    return this.generalQuestionsForm.get('isAlShifaaVolunteer')?.value === 'yes';
  }


  nextStep(): void {
    if ( this.step < this.stepLabels.length) {
      this.step++;
    }
  }
  onStepChange(index: number): void {
    this.step = index + 1;
  }
  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.personalInfoForm.get(controlName);
    return !!control?.hasError(errorCode) && (control.dirty || control.touched || false);

  }
  hasError1(controlName: string, errorType: string): boolean {
    const control = this.generalForm.get(controlName);
    return !!control?.touched && control.hasError(errorType);
  }

  hasError2(controlName: string, errorCode: string): boolean {
    const control = this.generalQuestionsForm.get(controlName);
    return !!control?.hasError(errorCode) && (control.dirty || control.touched || false);
  }
  hasError3(controlName: string, errorCode: string): boolean {
    const control = this.requiredDocumentsForm.get(controlName);
    return !!control?.hasError(errorCode) && (control.dirty || control.touched || false);
  }
  

  onNextStep() {
    if (this.step < this.stepLabels.length) {
      this.step++;
      console.log('Navigated to step:', this.step); // Debug
    }
  }
  
  goToStep(step: number) {
    console.log('Changing to step:', step); // Check if this is triggered
    this.step = step;
  }
  get disabilityTypes(): FormArray {
    return this.generalQuestionsForm.get('disabilityTypes') as FormArray;
  }
  isCheckedDisabilityType(value: string): boolean {
    return this.disabilityTypes.value.includes(value);
  }
  toggleDisabilityType(value: string): void {
    const disabilityArray = this.disabilityTypes;
  
    if (disabilityArray.value.includes(value)) {
      // Remove the value if already selected
      const index = disabilityArray.value.indexOf(value);
      disabilityArray.removeAt(index);
    } else {
      // Add the value if not selected
      disabilityArray.push(this.fb.control(value));
    }
  }
      
  
// Get the FormArray for computerSkills
get computerSkills(): FormArray {
  return this.trainingsAndSkillsForm.get('skills.computerSkills') as FormArray;
}

// Check if a value is selected
isCheckedCs(value: string): boolean {
  return this.computerSkills.value.includes(value); 
}

get innovationLabGradtype(): FormArray {
  return this.generalQuestionsForm.get('innovationLabGradtype') as FormArray;
}

isCheckedLabType(value: string): boolean {
  return this.innovationLabGradtype.value.includes(value);
}


// Toggle the checkbox selection
toggleCheckbox(value: string): void {
  const skillsArray = this.computerSkills;

  if (skillsArray.value.includes(value)) {
    // If it's already selected, remove it
    const index = skillsArray.value.indexOf(value);
    skillsArray.removeAt(index);
  } else {
    // If it's not selected, add it
    skillsArray.push(this.fb.control(value));
  }
}
// Toggle the checkbox selection
toggleLabType(value: string): void {
  const labTypeArray = this.innovationLabGradtype;

  if (labTypeArray.value.includes(value)) {
    // Remove the value if already selected
    const index = labTypeArray.value.indexOf(value);
    labTypeArray.removeAt(index);
  } else {
    // Add the value if not selected
    labTypeArray.push(this.fb.control(value));
  }
}

get arabicControl(): FormControl {
  return this.languageSkills.get('arabic') as FormControl;
}

get englishControl(): FormControl {
  return this.languageSkills.get('english') as FormControl;
}

get frenchControl(): FormControl {
  return this.languageSkills.get('french') as FormControl;
}

get languageSkills(): FormGroup {
  return this.trainingsAndSkillsForm.get('skills') as FormGroup;
}
isCheckedL(value: string): boolean {
  return this.languageSkills.value.includes(value);
}

// Example method in your component class
onFileChange(event: Event, fileNameId: string): void {
  const input = event.target as HTMLInputElement;
  const fileName = input?.files?.[0]?.name || "No file chosen";
  const fileNameElement = document.getElementById(fileNameId);
  if (fileNameElement) {
    fileNameElement.textContent = fileName;
  }
}





updatePatternError() {
  const control = this.personalInfoForm.get('personalRegistrationNumber');
  if (control?.errors?.['pattern']) {
    setTimeout(() => {
      // Show the error only if the control still has the error
      this.showPatternError = control.errors?.['pattern'] ? true : false;
    }, 300); // Delay to allow user to complete typing
  } else {
    this.showPatternError = false; // Hide the error if there are no pattern issues
  }
}

    saveToJson(): void {
      const youth = this.createYouthModel();
      this.allUsersData.push(youth);
  
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
    createYouthModel(): Youth {
      return {
        id: this.generateUniqueId(),
        username: this.personalInfoForm.value.personalRegistrationNumber,
        password: this.requiredDocumentsForm.value.password,
        role: 'Youth',
    
        // Personal Information
        ...this.personalInfoForm.value,
    
        // General Information
        ...this.generalForm.value,
    
        // General Questions
        ...this.generalQuestionsForm.value,
        innovationLabGradtype: this.generalQuestionsForm.value.innovationLabGradtype,
        disabilityTypes: this.generalQuestionsForm.value.disabilityTypes,

    
        // Experience Details
        experiences: this.experienceDetailsForm.value.experiences,
    
        // Trainings and Skills
        trainings: this.trainingsAndSkillsForm.value.trainings,
        computerSkills: this.trainingsAndSkillsForm.value.computerSkills,
        arabic: this.skillsForm.value.arabic,
        english: this.skillsForm.value.english,
        french: this.skillsForm.value.french,    
        // Required Documents
        ...this.requiredDocumentsForm.value,
      };
    }
    
    onSubmit(): void {
      const youth = this.createYouthModel();
  
      this.youthService.submitFormData(youth).subscribe(
        (response) => {
          console.log('Form data submitted successfully:', response);
          alert('Form data saved successfully!');
        },
        (error) => {
          console.error('Error submitting form data:', error);
          alert('Failed to save form data.');
        }
      );
    }

    generateUniqueId(): string {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
        
    }

    
  }
  


