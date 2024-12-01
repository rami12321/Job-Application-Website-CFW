import { Component, Input, OnInit } from '@angular/core';
import { Youth } from '../../../Model/Youth';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs'; 

@Component({
  selector: 'app-youthsignup-details',
  standalone: true,
  imports: [CommonModule, TabViewModule, ReactiveFormsModule, MatTabsModule,],
  templateUrl: './youthsignup-details.component.html',
  styleUrls: ['./youthsignup-details.component.css'],
})
export class YouthSignupDetailsComponent implements OnInit {
    // Mock Data
    introForm = {
      confirm: true,
    };
  
    personalInfoForm = {
      firstNameEn: 'John',
      lastNameEn: 'Doe',
      familyRegistrationNumber: '12345678',
      fatherNameEn: 'Mark',
      mobilePhone: '+1234567890',
      whatsapp: '+1234567890',
      firstNameAr: 'جون',
      lastNameAr: 'دو',
      fatherNameAr: 'مارك',
      emergencyPhone: '+0987654321',
      emergencyRelation: 'Brother',
      email: 'john.doe@example.com',
      gender: 'Male',
      headfa: 'Yes',
      dob: '1990-01-01',
      area: 'Central',
      nationality: 'American',
      campType: 'Urban',
      registrationStatus: 'Complete',
      camp: 'Camp A',
      personalRegistrationNumber: '87654321',
      fullAddress: '1234 Elm Street, Some City, USA',
    };
  
    generalQuestionsForm = {
      placedByKfw: 'Yes',
      kfwYear: '2020',
      innovationLabGraduate: 'Yes',
      innovationLabGradtype: ['Entrepreneurship', 'Technology'],
      digitalSkills: 'Advanced',
      disability: 'No',
      disabilitySupport: 'N/A',
      disabilityTypes: [],
      employed: 'Yes',
      seekingEmploymentDuration: '6 months',
      isPrcsVolunteer: 'Yes',
      isFireBrigadesVolunteer: 'No',
      isAlShifaaVolunteer: 'Yes',
    };
  
    experienceDetailsForm = {
      experiences: [
        {
          type: 'Full-time',
          employerName: 'ABC Corp',
          employerPhone: '+1123456789',
          area: 'Engineering',
          employmentType: 'Permanent',
          jobTitle: 'Software Engineer',
          startDate: '2018-01-01',
          endDate: '2020-12-31',
          salary: '$4000',
          mainTasks: 'Developed web applications, maintained codebase',
        },
        {
          type: 'Part-time',
          employerName: 'XYZ Ltd',
          employerPhone: '+1987654321',
          area: 'IT',
          employmentType: 'Contract',
          jobTitle: 'Web Developer',
          startDate: '2021-01-01',
          endDate: '2023-01-01',
          salary: '$2000',
          mainTasks: 'Designed user interfaces, built APIs',
        },
      ],
    };
  
    trainingsAndSkillsForm = {
      trainings: [
        {
          institution: 'Tech Academy',
          certificate: 'Full-Stack Development',
          area: 'Web Development',
          durationFrom: '2017-01-01',
          durationTo: '2017-06-30',
        },
        {
          institution: 'AI Institute',
          certificate: 'Machine Learning Basics',
          area: 'Artificial Intelligence',
          durationFrom: '2020-01-01',
          durationTo: '2020-04-01',
        },
      ],
      skills: {
        arabic: 'Intermediate',
        english: 'Fluent',
        french: 'Basic',
        computerSkills: ['JavaScript', 'Python', 'SQL', 'Docker'],
      },
    };
  
    requiredDocumentsForm = {
      cv: 'Uploaded',
      coverLetter: 'Uploaded',
      identityCard: 'Uploaded',
      registrationCard: 'Uploaded',
      degree: 'Uploaded',
      prcsProof: 'Uploaded',
      fireProof: 'Not Provided',
      alShifaaProof: 'Uploaded',
      password: '*******', // Masked for security
    };
    generalForm={
        jobOpportunitySource: 'Social Media',
        educationGraduate: 'Yes',
        educationLevel: 'Bachelor\'s Degree',
        major: 'Computer Science',
        institution: 'Near East University',
        gradplace: 'Nicosia, Cyprus',
        graduationDate: '2024-06-15',
        employmentOpportunities: 'UNRWA',
        aboutYourself: 'I am a dedicated and enthusiastic graduate with a strong background in software engineering. I am motivated to learn and grow while contributing to meaningful projects.',
      
    };
    constructor() {}
  
    ngOnInit(): void {}
  }