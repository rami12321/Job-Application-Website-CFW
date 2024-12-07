import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { Youth } from '../../Model/Youth';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-youthprofile',
  standalone: true,
  imports: [CommonModule, TabViewModule, ReactiveFormsModule, MatTabsModule, PdfViewerModule, FormsModule],
  templateUrl: './youthprofile.component.html',
  styleUrls: ['./youthprofile.component.css']
})
export class YouthprofileComponent implements OnInit {
  isPdfModalOpen = false;
  currentPdfUrl: string | null = null;
  public youth: Youth | undefined;

  // Object to track edit states for each section
  isEditing: { [key: string]: boolean } = {};

  // Object to track edit models for each section
  editModels: { [key: string]: any } = {}; // Change to `any` for flexibility

  private userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private youthService: YouthServiceService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.fetchYouthDetails();
    }
  }

  private fetchYouthDetails(): void {
    this.youthService.getYouthById(this.userId!).subscribe({
      next: (data: Youth) => {
        this.youth = data;
      },
      error: (err) => {
        console.error('Error fetching youth data:', err);
      },
    });
  }

  openPdfModal(fileName: string): void {
    this.currentPdfUrl = `assets/PDF-Static/${fileName}`;
    this.isPdfModalOpen = true;
  }

  closePdfModal(): void {
    this.isPdfModalOpen = false;
    this.currentPdfUrl = null;
  }
  toggleEditExperience(index: number): void {
    if (this.youth?.experiences) {
      this.youth.experiences[index].isEditing = true;
    }
  }
  
  cancelEditExperience(index: number): void {
    if (this.youth?.experiences) {
      this.youth.experiences[index].isEditing = false;
    }
  }
  
  saveChangesexp(section: string, index: number): void {
    if (section === 'experience') {
      const updatedExperiences = this.youth!.experiences.map((experience) => {
        const { isEditing, ...experienceData } = experience;
        return experienceData;
      });
  
      this.youthService.updateYouthExperience(this.youth!.id, updatedExperiences).subscribe({
        next: () => {
          console.log('Experience updated successfully');
          this.youth!.experiences[index].isEditing = false;  
        },
        error: (err) => {
          console.error('Error updating experiences', err);
        },
      });
    }
  }
  
  
    toggleEditTraining(index: number): void {
      if (this.youth?.trainings) {
        this.youth.trainings[index].isEditing = true;
      }
    }
  
    cancelEditTraining(index: number): void {
      if (this.youth?.trainings) {
        this.youth.trainings[index].isEditing = false;
      }
    }
  
    saveChangesTraining(section: string, index: number): void {
      if (section === 'trainings') {
        const updatedTrainings = this.youth!.trainings.map((training) => {
          const { isEditing, ...trainingData } = training;
          return trainingData;
        });
    
        this.youthService.updateYouthTraining(this.youth!.id, updatedTrainings).subscribe({
          next: () => {
            console.log('Training updated successfully');
            this.youth!.trainings[index].isEditing = false;  
          },
          error: (err) => {
            console.error('Error updating training:', err);
          },
        });
      }
    }
    
  

  toggleEdit(section: string): void {
    this.isEditing[section] = true;

    this.editModels[section] = { ...this.youth };
  }

  saveChanges(section: string): void {
    if (!this.editModels[section]) return;

    if (this.youth) {
      Object.assign(this.youth, this.editModels[section]);
    }

    this.youthService.updateYouth(this.userId!, this.editModels[section]).subscribe({
      next: () => {
        console.log(`Section ${section} updated successfully`);
        this.isEditing[section] = false;
      },
      error: (err) => {
        console.error(`Error updating section ${section}:`, err);
      },
    });
  }

  cancelEdit(section: string): void {
    this.isEditing[section] = false;

    this.editModels[section] = {};
  }
}

