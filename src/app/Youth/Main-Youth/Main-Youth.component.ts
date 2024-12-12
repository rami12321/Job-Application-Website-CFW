import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';

@Component({
  selector: 'app-Main-Youth',
  templateUrl: './Main-Youth.component.html',
  standalone: true,
  styleUrls: ['./Main-Youth.component.css'],
  imports: [FormsModule, CommonModule],
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

  constructor(private lookupService: LookupService,   private youthService: YouthServiceService,
  ) {}

  ngOnInit() {
    this.userName = localStorage.getItem('firstName') || '';
    this.jobStatus = localStorage.getItem('status') || '';
    this.notes = localStorage.getItem('notes') || '';

    this.lookupService.getJobCategories().subscribe((data: any) => {
      if (data && data.length > 0 && data[0].categories) {
        this.jobCategories = data[0].categories; // Assign the categories object
      } else {
        console.error('Unexpected data format:', data);
      }
    });
  }

  onSelectCategory(category: string) {
    this.selectedCategory = category;
    this.subcategories = this.jobCategories[category] || [];
    this.selectedSubcategory = ''; // Reset subcategory selection
  }

  updateCategoryJob(id: number, jobCategory: string): void {
    if (!jobCategory) {
      console.error('Job category is required');
      return;
    }

    // Construct the payload with the required "jobCategory" field
    const payload = { jobCategory };  // Ensure this matches the backend

    this.youthService.updateYouthCategoryJob(id, payload).subscribe(
      (response) => {
        console.log(`Job Category updated to ${jobCategory} for youth with ID: ${id}`);
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
