import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { Youth } from '../../Model/Youth';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LookupService } from '../../Services/LookUpService/lookup.service';

@Component({
  selector: 'app-youthprofile',
  standalone: true,
  imports: [CommonModule, TabViewModule, ReactiveFormsModule, MatTabsModule, PdfViewerModule, FormsModule],
  templateUrl: './youthprofile.component.html',
  styleUrls: ['./youthprofile.component.css']
})
export class YouthprofileComponent implements OnInit {
  isPdfModalOpen = false;
  isPdfModalOpen1 = false;

  currentPdfUrl: string | null = null;
  public youth: Youth | undefined;
  majors: string[] = [];
  lookupData: any = {};
  campTypeOptions: string[] = [];
  campOptions!: string[] ;
  modalType: 'static' | 'uploaded' = 'static'; // Determine which file to show in the modal
  isEditing: { [key: string]: boolean } = {};
  staticFileName: string = 'CV-Example.pdf'; // Static file name
  cvFileName: string = ''; // Initially empty for the uploaded file name
  storedPdfUrl: string | null = ''; // Blob URL of the uploaded file
  areaOptions: string[] = [];
  cvFileUrl: string | null = null;

  pdfSrc: Uint8Array | null = null;
  showModal: boolean = false;
  pdfKey: number = 0;  // Object to track edit models for each section
  editModels: { [key: string]: any } = {}; // Change to `any` for flexibility
  isOtherMajorSelected = false;
  disabilityTypes = [
    'Speech / communication',
    'Psychosocial / Mental Health',
    'Physical',
    'Neurodivergent',
    'Deaf or hard of hearing',
    'Cognitive',
    'Blind or low vision'
  ];
  private userId: number | null = null;
  private areaData: any;

  constructor(
    private route: ActivatedRoute,
    private youthService: YouthServiceService,
    private lookupService: LookupService,

  ) {}

  ngOnInit(): void {
    // Fetch lookup data from the service
    this.lookupService.getLookupData().subscribe(
      (data) => {
        this.lookupData = data;
        // Set area options using the names of the areas
        this.areaOptions = this.lookupData.areas.map((area: any) => area.name);
        console.log('Lookup data loaded:', this.lookupData);
      },
      (error) => {
        console.error('Error loading lookup data:', error);
      });

    // Set initial values for editModels if youth data is available
    if (this.youth) {
      this.editModels['personal'].area = this.youth?.area || '';
      this.editModels['personal'].campType = this.youth?.campType || '';
      this.editModels['personal'].camp = this.youth?.camp || '';
    }

    this.lookupService.getMajors().subscribe((data) => {
      this.majors = data;
    });
  
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
    this.storedPdfUrl = this.cvFileUrl;

  }
  
  // Close the modal




    
    onFileChange(event: Event, controlName: string): void {
      const input = event.target as HTMLInputElement;
    
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.cvFileName = file.name; // Set the file name for display after saving
    
        if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const fileReader = new FileReader();
    
          fileReader.onload = () => {
            if (fileReader.result instanceof ArrayBuffer) {
              const blob = new Blob([fileReader.result], { type: 'application/pdf' });
              this.storedPdfUrl = URL.createObjectURL(blob); // Create the Blob URL for preview
              console.log('PDF Blob URL created:', this.storedPdfUrl);
            } else {
              console.error('Error: FileReader result is not an ArrayBuffer.');
            }
          };
    
          fileReader.onerror = (error) => {
            console.error('Error reading file:', error);
          };
    
          fileReader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
        } else {
          console.error('Invalid file type. Only PDF, DOC, DOCX files are allowed.');
        }
      }
    }
    cancelEditing(field: string): void {
      if (field === 'cv') {
        // Revert any changes to the file name and editing state
        this.cvFileName = this.cvFileName || 'CV-Example.pdf'; // Reset to static file name if no file was uploaded
        this.isEditing[field] = false; // Exit editing mode
      }
    }
    
  onMajorChange(event: any): void {
    const selectedMajor = event.target.value;
  
    if (selectedMajor === 'other') {
      this.isOtherMajorSelected = true;
      this.editModels['general'].get('major')?.setValue(''); // Clear the major field before user input
      this.editModels['general'].get('major')?.setValidators([Validators.required]); // Make major field required when custom input is provided
      this.editModels['general'].get('major')?.updateValueAndValidity();
    } else {
      this.isOtherMajorSelected = false;
      this.editModels['general'].get('major')?.setValidators([Validators.required]); // Keep it required when selecting a standard option
      this.editModels['general'].get('major')?.updateValueAndValidity();
    }
  }

  isCheckedLabType(type: string): boolean {
    return this.editModels['generalQuestions'].innovationLabGradtype?.includes(type);
  }
  
  toggleLabType(type: string): void {
    const gradTypeArray = this.editModels['generalQuestions'].innovationLabGradtype || [];
    const index = gradTypeArray.indexOf(type);
    if (index === -1) {
      gradTypeArray.push(type);
    } else {
      gradTypeArray.splice(index, 1);
    }
    this.editModels['generalQuestions'].innovationLabGradtype = gradTypeArray;
  }
  
  onAreaChange(selectedArea: string): void {
    if (selectedArea) {
      const selectedAreaData = this.lookupData.areas.find(
        (area: any) => area.name === selectedArea
      );
  
      // Update campTypeOptions based on selected area
      this.campTypeOptions = selectedAreaData ? selectedAreaData.options : [];
      if (this.editModels['personal'].area !== this.youth?.area) {
        // If the area changes, reset campType and camp
        this.campOptions = [];

        this.editModels['personal'].campType = '';
        this.editModels['personal'].camp = '';
      }
    } else {
      this.campTypeOptions = [];
      this.campOptions = [];
      this.editModels['personal'].campType = '';
      this.editModels['personal'].camp = '';
    }
  }

  
  isCheckedDisabilityType(type: string): boolean {
    return this.editModels['generalQuestions'].disabilityTypes?.includes(type);
  }
  
  toggleDisabilityType(type: string): void {
    const types = this.editModels['generalQuestions'].disabilityTypes || [];
    const index = types.indexOf(type);
    if (index > -1) {
      types.splice(index, 1); // Remove if already selected
    } else {
      types.push(type); // Add if not selected
    }
    this.editModels['generalQuestions'].disabilityTypes = types;
  }
  
  onCampTypeChange(selectedType: string): void {
    if (selectedType === 'Inside Camp') {
      const selectedArea = this.editModels['personal'].area;
      const selectedAreaData = this.lookupData.areas.find(
        (area: any) => area.name === selectedArea
      );
      // Update camp options based on selected area
      this.campOptions = selectedAreaData ? selectedAreaData.camps : [];
  
      // Restore previously filled camp if it exists
      if (this.youth?.campType === 'Inside Camp' && this.youth?.area === selectedArea) {
        this.editModels['personal'].camp = this.youth.camp;
      }
    } else {
      // Clear camp options and reset camp field
      this.campOptions = [];
      if (this.editModels['personal'].camp) {
        this.removeCampFromDatabase(); // Call a method to delete camp from DB
      }
      this.editModels['personal'].camp = '';
    }
  }
  removeCampFromDatabase(): void {
    const userId = this.youth?.id; // Assuming the user ID is available in `this.youth`
    if (userId) {
      this.youthService.deleteCamp(userId).subscribe(
        () => console.log('Camp data deleted successfully.'),
        (error) => console.error('Failed to delete camp data:', error)
      );
    }}  

openPdfModal(): void {
  if (this.storedPdfUrl) {
    this.isPdfModalOpen1 = true;
    console.log('PDF Blob URL ready for modal:', this.storedPdfUrl);
  } else {
    console.error('No PDF content available to display.');
  }
}
  // Open the modal for file preview
  openPdfModal1(source: 'static' | 'uploaded'): void {
    console.log('Opening modal for:', source);
  
    if (source === 'static') {
      this.storedPdfUrl = 'path/to/CV-Example.pdf'; // Replace with your actual static file URL
    }
  
    // Ensure `isPdfModalOpen` controls a single modal instance
    this.isPdfModalOpen1 = true;
  }
  
  closePdfModal1(): void {
    this.isPdfModalOpen1 = false;
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
    toggleEditing(field: string): void {
      if (this.isEditing[field]) {
        // Save the file and update the displayed file name
        console.log('Saving CV...');
        if (this.storedPdfUrl) {
          // Ensure the uploaded file's name replaces the static link after saving
          this.cvFileName = this.cvFileName || 'CV-Example.pdf'; // Use uploaded file name or default to static
        }
      }
      this.isEditing[field] = !this.isEditing[field];
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

