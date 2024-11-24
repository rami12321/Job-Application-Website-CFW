import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray } from '@angular/forms';
import {  YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { CommonModule } from '@angular/common';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-youth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ],
  templateUrl: './SignUp-Youth.component.html',
  styleUrls: ['./SignUp-Youth.component.css']
})
export class SignUpYouthComponent implements OnInit {
  introForm: FormGroup;
  personalInfoForm: FormGroup;
  lookupData: any = {};
  generalForm: FormGroup;
  generalQuestionsForm: FormGroup;
  experienceDetailsForm: FormGroup;
  requiredDocumentsForm: FormGroup;
  formSubmitted: boolean = false;

  step: number = 1;
  areaOptions: string[] = [];
  campTypeOptions: string[] = [];
  campOptions: string[] = [];
  private areaData: any;
  majors: string[] = [];
  allUsersData: any[] = [];

  trainingsAndSkillsForm: FormGroup;

  jobOpportunityOptions = [
    'WhatsApp Message from Employment Services Team',
    'WhatsApp Message from Area Offices',
    "UNRWA's Facebook Page",
    'NGOs',
    'Friends',
  ];
  
  educationLevels = [
    'University Degree, Technical Licence (LT), University Diploma',
    'Short Term Course, Experience Work Certificate, or Diploma from Siblin Training Center',
    'Technical Baccalaureate (BT) or equivalent from Siblin Training Center (STC)',
    'Higher Technical Degree (TS) or equivalent from Siblin Training Center (STC)',
  ];
  additionalQuestions = [
    {
      label: 'Are you a volunteer with Palestinian Red Crescent Society (PRCS)?',
      controlName: 'question3',
    },
    {
      label: 'Are you a volunteer with the Palestinian Fire Brigades Lebanese Camps?',
      controlName: 'question4',
    },
    {
      label: 'Are you a volunteer with Al-Shifaa for Medical & Humanitarian Services?',
      controlName: 'question5',
    },
    {
      label: 'Are you a graduate of the UNRWA Innovation Lab?',
      controlName: 'question6',
    },
    {
      label: 'Do you have any disability?',
      controlName: 'question7',
      includePreferNotToState: true,
    },
    {
      label: 'Are you Currently Employed?',
      controlName: 'question8',
    },
  ];
  
  

  
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
computerSkills: any;

  constructor(private fb: FormBuilder, private youthService: YouthServiceService, private lookupService: LookupService, private http: HttpClient
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
      socialEntrepreneurship: [false],
      digitalSkills: [false], 

      disability: ['', Validators.required],
      disabilitySupport: [''], 
      disabilityTypes: this.fb.group({
        speech: [false],
        psychosocial: [false],
        physical: [false],
        neurodivergent: [false],
        deaf: [false],
        cognitive: [false],
        blind: [false],
      }),

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
        computerSkills: this.fb.array([]),
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
    });
    
    

    this.areaData = this.youthService.getAreaData();
  }

  ngOnInit(): void {
    this.lookupService.getLookupData().subscribe((data) => {
      this.lookupData = data;
    });
    this.youthService.fetchAreaData().subscribe((data) => {
      this.youthService.setAreaData(data);
      this.areaData = this.youthService.getAreaData();
      this.areaOptions = this.youthService.getAreaOptions();
    });
    
  
    this.youthService.getMajors().subscribe((data) => {
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

  onChanges(): void {
    this.personalInfoForm.get('area')?.valueChanges.subscribe((selectedArea) => {
      if (selectedArea) {
        const selectedData = this.areaData[selectedArea];
        this.campTypeOptions = selectedData.options || [];
        this.campOptions = [];
        this.personalInfoForm.get('campType')?.reset();
        this.personalInfoForm.get('camp')?.reset();
      }
    });

    this.personalInfoForm.get('campType')?.valueChanges.subscribe((selectedType) => {
      if (selectedType === 'Inside Camp') {
        const selectedArea = this.personalInfoForm.get('area')?.value;
        this.campOptions = this.areaData[selectedArea]?.camps || [];
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
  
  collectFormData() {
    const personalInfo = this.personalInfoForm.value;
    const generalInfo = this.generalForm.value;
    const generalQuestions = this.generalQuestionsForm.value;
    const experienceDetails = this.experienceDetailsForm.value;
    const trainingsAndSkills = this.trainingsAndSkillsForm.value;
    const requiredDocuments = this.requiredDocumentsForm.value;

    const formData = {
      id: this.generateUniqueId(), 
      personalInformation: {
        firstNameEn: personalInfo.firstNameEn,
        lastNameEn: personalInfo.lastNameEn,
        gender: personalInfo.gender,
        dob: personalInfo.dob,
        nationality: personalInfo.nationality,
        mobilePhone: personalInfo.mobilePhone,
        whatsapp: personalInfo.whatsapp,
        email: personalInfo.email,
        area: personalInfo.area,
        fullAddress: personalInfo.fullAddress,
        campType: personalInfo.campType,
        camp: personalInfo.camp,
      },
      generalInformation: {
        jobOpportunitySource: generalInfo.jobOpportunitySource,
        educationLevel: generalInfo.educationLevel,
        major: generalInfo.major,
        institution: generalInfo.institution,
        graduationDate: generalInfo.graduationDate,
        gradplace: generalInfo.gradplace,
        employmentOpportunities: generalInfo.employmentOpportunities,
        aboutYourself: generalInfo.aboutYourself,
      },
      generalQuestions: {
        placedByKfw: generalQuestions.placedByKfw,
        kfwYear: generalQuestions.kfwYear,
        innovationLabGraduate: generalQuestions.innovationLabGraduate,
        disability: generalQuestions.disability,
        disabilitySupport: generalQuestions.disabilitySupport,
        employed: generalQuestions.employed,
        seekingEmploymentDuration: generalQuestions.seekingEmploymentDuration,
        isPrcsVolunteer: generalQuestions.isPrcsVolunteer,
        isFireBrigadesVolunteer: generalQuestions.isFireBrigadesVolunteer,
        isAlShifaaVolunteer: generalQuestions.isAlShifaaVolunteer,
      },
      experienceDetails: experienceDetails.experiences, 
      trainingsAndSkills: trainingsAndSkills.trainings, 
      requiredDocuments: requiredDocuments, 
    };

    return formData;
  }

  generateUniqueId() {
    return 'user_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
  }

  saveToJson(): void {
    const formData = this.collectFormData();
    this.allUsersData.push(formData);

    const json = JSON.stringify(this.allUsersData, null, 2); 

    const blob = new Blob([json], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'youthdb.json'; 

    link.click();

    URL.revokeObjectURL(url);
    this.formSubmitted = true;

    setTimeout(() => {
      this.formSubmitted = false;
    }, 3000);
  }
  onSubmit() {
    const formData = this.collectFormData();

    this.youthService.submitFormData(formData).subscribe(
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

}

