import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { Youth } from '../../Model/Youth';
import { PasswordModule } from 'primeng/password';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-sign-up-youth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PasswordModule, StepperModule, ButtonModule, HttpClientModule, PdfViewerModule],
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
  showPatternError = false;
  pdfSrc: Uint8Array | null = null;
  showModal: boolean = false;
  storedPdfUrl: string | null = null;
  pdfKey: number = 0;

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
  isOtherMajorSelected = false;
  cvFileName: string | null = null;
  cvFileUrl: string | null = null;
  coverLetterFileName: string | null = null;
  coverLetterFileUrl: string | null = null;

  identityCardFileName: string | null = null;
  identityCardFileUrl: string | null = null;

  registrationCardFileName: string | null = null;
  registrationCardFileUrl: string | null = null;

  degreeFileName: string | null = null;
  degreeFileUrl: string | null = null;

  prcsProofFileName: string | null = null;
  prcsProofFileUrl: string | null = null;

  fireProofFileName: string | null = null;
  fireProofFileUrl: string | null = null;

  alShifaaProofFileName: string | null = null;
  alShifaaProofFileUrl: string | null = null;

  isPdfModalclOpen: boolean = false;

  isPdfModalOpen: boolean = false;
  isPdfModalIdentityCardOpen: boolean = false;
  isPdfModalRegistrationCardOpen: boolean = false;
  isPdfModalDegreeOpen: boolean = false;
  isPdfModalPrcsProofOpen: boolean = false;
  isPdfModalFireProofOpen: boolean = false;
  isPdfModalAlShifaaProofOpen: boolean = false;

  currentPdfUrl: string | null = null;
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
      otherMajor: ['', this.isOtherMajorSelected ? Validators.required : null],

      institution: ['', Validators.required],
      graduationDate: ['', Validators.required],
      gradplace: ['', Validators.required],
      employmentOpportunities: ['', Validators.required],
      aboutYourself: ['', Validators.required],
    });


    this.generalQuestionsForm = this.fb.group({
      placedByKfw: ['', Validators.required],
      kfwYear: [''],
      stcgraduate: ['', Validators.required],

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


    }, { validators: this.passwordsMatch });



    this.areaData = this.lookupService.getAreaData();
  }

  ngOnInit(): void {
    this.lookupService.getLookupData().subscribe(
      (data) => {
        this.lookupData = data;
        this.areaOptions = this.lookupData.areas.map((area: any) => area.name);


        console.log('Lookup data loaded:', this.lookupData);
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
      ?.valueChanges.pipe(debounceTime(400))
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

  registrationNumberValidator(control: AbstractControl): Observable<any> {
    const value = control.value;

    if (!value || !/^2-\d{8}$/.test(value)) {
      return of(null);
    }

    return this.youthService.checkPersonalRegistrationNumber(value).pipe(
      switchMap((response) => {
        if (response.inUse) {
          return of({ alreadyExists: true });
        }
        return of(null);
      }),
      catchError(() => of(null))
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
    if (this.step < this.stepLabels.length) {
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
      console.log('Navigated to step:', this.step);
    }
  }

  goToStep(step: number) {
    console.log('Changing to step:', step);
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

      const index = disabilityArray.value.indexOf(value);
      disabilityArray.removeAt(index);
    } else {

      disabilityArray.push(this.fb.control(value));
    }
  }



  get computerSkills(): FormArray {
    return this.trainingsAndSkillsForm.get('skills.computerSkills') as FormArray;
  }


  isCheckedCs(value: string): boolean {
    return this.computerSkills.value.includes(value);
  }

  get innovationLabGradtype(): FormArray {
    return this.generalQuestionsForm.get('innovationLabGradtype') as FormArray;
  }

  isCheckedLabType(value: string): boolean {
    return this.innovationLabGradtype.value.includes(value);
  }


  toggleCheckbox(value: string): void {
    const skillsArray = this.computerSkills;

    if (skillsArray.value.includes(value)) {
      const index = skillsArray.value.indexOf(value);
      skillsArray.removeAt(index);
    } else {
      skillsArray.push(this.fb.control(value));
    }
  }
  toggleLabType(value: string): void {
    const labTypeArray = this.innovationLabGradtype;

    if (labTypeArray.value.includes(value)) {
      const index = labTypeArray.value.indexOf(value);
      labTypeArray.removeAt(index);
    } else {
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


  openPdfModalDegree(): void {
    if (this.degreeFileUrl) {
      this.isPdfModalDegreeOpen = true;
      console.log('PDF Blob URL ready for modal:', this.degreeFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalDegree(): void {
    this.isPdfModalDegreeOpen = false;
  }
  openPdfModalPrcsProof(): void {
    if (this.prcsProofFileUrl) {
      this.isPdfModalPrcsProofOpen = true;
      console.log('PDF Blob URL ready for modal:', this.prcsProofFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalPrcsProof(): void {
    this.isPdfModalPrcsProofOpen = false;
  }

  onFileChangePrcsProof(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.prcsProofFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.prcsProofFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.prcsProofFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }

  openPdfModalAlShifaaProof(): void {
    if (this.alShifaaProofFileUrl) {
      this.isPdfModalAlShifaaProofOpen = true;
      console.log('PDF Blob URL ready for modal:', this.alShifaaProofFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalAlShifaaProof(): void {
    this.isPdfModalAlShifaaProofOpen = false;
  }

  onFileChangeAlShifaaProof(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.alShifaaProofFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.alShifaaProofFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.alShifaaProofFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }
  openPdfModalFireProof(): void {
    if (this.fireProofFileUrl) {
      this.isPdfModalFireProofOpen = true;
      console.log('PDF Blob URL ready for modal:', this.fireProofFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalFireProof(): void {
    this.isPdfModalFireProofOpen = false;
  }

  onFileChangeFireProof(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fireProofFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.fireProofFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.fireProofFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }

  onFileChangeDegree(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.degreeFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.degreeFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.degreeFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }
  openPdfModalRegistrationCard(): void {
    if (this.registrationCardFileUrl) {
      this.isPdfModalRegistrationCardOpen = true;
      console.log('PDF Blob URL ready for modal:', this.registrationCardFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalRegistrationCard(): void {
    this.isPdfModalRegistrationCardOpen = false;
  }

  onFileChangeRegistrationCard(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.registrationCardFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.registrationCardFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.registrationCardFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }
  openPdfModalIdentityCard(): void {
    if (this.identityCardFileUrl) {
      this.isPdfModalIdentityCardOpen = true;
      console.log('PDF Blob URL ready for modal:', this.identityCardFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }

  closePdfModalIdentityCard(): void {
    this.isPdfModalIdentityCardOpen = false;
  }

  onFileChangeIdentityCard(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.identityCardFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.identityCardFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.identityCardFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }

  openPdfModalr(fileType: string) {
    switch (fileType) {
      case 'cv':
        this.currentPdfUrl = this.storedPdfUrl;
        break;
      case 'coverLetter':
        this.currentPdfUrl = this.coverLetterFileUrl;
        break;
      case 'identityCard':
        this.currentPdfUrl = this.identityCardFileUrl;
        break;
      case 'registrationCard':
        this.currentPdfUrl = this.registrationCardFileUrl;
        break;
      case 'degree':
        this.currentPdfUrl = this.degreeFileUrl;
        break;
      case 'prcsProof':
        this.currentPdfUrl = this.prcsProofFileUrl;
        break;
      case 'fireProof':
        this.currentPdfUrl = this.fireProofFileUrl;
        break;
      case 'alShifaaProof':
        this.currentPdfUrl = this.alShifaaProofFileUrl;
        break;
    }
    this.isPdfModalOpen = true;
  }


  closePdfModalr() {
    this.isPdfModalOpen = false;
    this.currentPdfUrl = null;
  }

  openPdfModal(): void {
    if (this.storedPdfUrl) {
      this.isPdfModalOpen = true;
      console.log('PDF Blob URL ready for modal:', this.storedPdfUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }




  closePdfModal(): void {

    this.isPdfModalOpen = false;

  }


  openPdfModalcl(): void {
    if (this.coverLetterFileUrl) {
      this.isPdfModalclOpen = true;
      console.log('PDF Blob URL ready for modal:', this.coverLetterFileUrl);
    } else {
      console.error('No PDF content available to display.');
    }
  }




  closePdfModalcl(): void {

    this.isPdfModalclOpen = false;

  }

  onFileChangecl(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.coverLetterFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.coverLetterFileUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.coverLetterFileUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.cvFileName = file.name;

      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = () => {

          if (fileReader.result instanceof ArrayBuffer) {

            const blob = new Blob([fileReader.result], { type: 'application/pdf' });
            this.storedPdfUrl = URL.createObjectURL(blob);
            console.log('PDF Blob URL created:', this.storedPdfUrl);
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        fileReader.readAsArrayBuffer(file);



      }

    }
  }


  openFileModal(): void {
    this.showModal = true;
  }


  closeFileModal(): void {
    this.showModal = false;
  }





  updatePatternError() {
    const control = this.personalInfoForm.get('personalRegistrationNumber');
    if (control?.errors?.['pattern']) {
      setTimeout(() => {
        this.showPatternError = control.errors?.['pattern'] ? true : false;
      }, 300);
    } else {
      this.showPatternError = false;
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
  onMajorChange(event: any): void {
    const selectedMajor = event.target.value;

    if (selectedMajor === 'other') {
      this.isOtherMajorSelected = true;
      this.generalForm.get('major')?.setValue('');
      this.generalForm.get('major')?.setValidators([Validators.required]);
      this.generalForm.get('major')?.updateValueAndValidity();
    } else {
      this.isOtherMajorSelected = false;
      this.generalForm.get('major')?.setValidators([Validators.required]);
      this.generalForm.get('major')?.updateValueAndValidity();
    }
  }


  createYouthModel(): Youth {

    return {
      id: this.generateUniqueId(),
      username: this.personalInfoForm.value.personalRegistrationNumber,
      password: this.requiredDocumentsForm.value.password,
      role: 'Youth',
      status: 'waiting',

      ...this.personalInfoForm.value,


      ...this.generalForm.value,


      ...this.generalQuestionsForm.value,
      innovationLabGradtype: this.generalQuestionsForm.value.innovationLabGradtype,
      disabilityTypes: this.generalQuestionsForm.value.disabilityTypes,



      experiences: this.experienceDetailsForm.value.experiences,


      trainings: this.trainingsAndSkillsForm.value.trainings,
      computerSkills: this.trainingsAndSkillsForm.value.computerSkills,
      arabic: this.skillsForm.value.arabic,
      english: this.skillsForm.value.english,
      french: this.skillsForm.value.french,

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
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${randomNumber}`;
  }



}






