import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-Main-Youth',
  templateUrl: './Main-Youth.component.html',
  standalone: true,
  styleUrls: ['./Main-Youth.component.css'],
  imports: [FormsModule, CommonModule, MultiSelectModule, ReactiveFormsModule],
})
export class MainYouthComponent implements OnInit {
  jobStatus: string = '';
  showPopup: boolean = false;
  showNote: boolean = false;
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  mainCategories: string[] = [];
  subcategories: string[] = [];
  userName: string = '';
  notes: string = '';
  jobCategories: { [key: string]: string[] } = {}; // Key-value pairs for categories
  appliedJob: string | null = null;
  constructor(private lookupService: LookupService,   private youthService: YouthServiceService,
  ) {}

  ngOnInit() {
    const youthIdString = localStorage.getItem('userId');
    const youthId = youthIdString ? parseInt(youthIdString, 10) : null;

    // Handle null youthId case
    if (youthId !== null) {
      this.youthService.getAppliedJobById(youthId).subscribe(
        (response) => {
          this.appliedJob = response.appliedJob; // Set the applied job details in the component
          console.log(`Applied job for youth with ID: ${youthId} is: ${this.appliedJob}`);
        },
        (error) => {
          console.error('Error fetching applied job:', error);
        }
      );
    } else {
      console.error('Youth ID is null, cannot fetch applied job.');
    }

    this.userName = localStorage.getItem('firstName') || '';
    this.jobStatus = localStorage.getItem('status') || '';
    this.notes = localStorage.getItem('notes') || '';

    this.lookupService.getJobCategories().subscribe(
      (data: any) => {
        if (data && data[0]?.categories) {
          this.jobCategories = data[0].categories; // Ensure this matches the backend structure
        } else {
          console.error('Unexpected data format:', data);
        }
      },
      (error) => {
        console.error('Error fetching job categories:', error);
      }
    );
  }

  onSelectCategory(category: string) {
    this.selectedCategory = category;
    this.subcategories = this.jobCategories[category] || [];
    console.log('Selected subcategories:', this.subcategories); // Debug
  }


  updateCategoryJob(id: number, appliedJob: string): void {
    if (!appliedJob) {
      console.error('Job category is required');
      return;
    }

    // Construct the payload with the required "appliedJob" field
    const payload = { appliedJob };  // Ensure this matches the backend

    this.youthService.updateYouthCategoryJob(id, payload).subscribe(
      (response) => {
        console.log(`Job Category updated to ${appliedJob} for youth with ID: ${id}`);
        // Re-fetch or refresh the data to reflect the changes
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }



  applyForJob() {
    if (this.selectedCategory && this.selectedSubcategory) {
      console.log(
        `Applied for ${this.selectedSubcategory} under ${this.selectedCategory}`
      );

      const youthIdString = localStorage.getItem('userId'); // Retrieve from localStorage
      const youthId = youthIdString ? parseInt(youthIdString, 10) : null; // Convert to number

      if (youthId) {
        this.updateCategoryJob(youthId, this.selectedSubcategory); // Pass ID and subcategory
        this.showPopup = false;
      } else {
        console.error('Invalid youth ID. ');
        alert('Could not retrieve user ID. Please try again.');
      }
    } else {
      alert('Please select a category and a subcategory.');
    }
  }

   closePopup() {
    this.showPopup = false;
  }

  closeNotes() {
    this.showNote = false;
  }

  acceptJob() {
    this.showPopup = true;
  }

  viewNotes() {
    this.showNote = true;
  }
}
