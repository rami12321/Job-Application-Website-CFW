import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';  // Import the AccordionModule
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/auth-service.service';

@Component({
  selector: 'app-Main-Youth',
  templateUrl: './Main-Youth.component.html',
  standalone: true,
  styleUrls: ['./Main-Youth.component.css'],
  imports: [FormsModule, CommonModule, MultiSelectModule, ReactiveFormsModule, AccordionModule],
})
export class MainYouthComponent implements OnInit {
  jobStatus: string = '';
  showdetailsPopup:boolean=false;
  showPopup: boolean = false;
  showNote: boolean = false;
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  mainCategories: string[] = [];
  subcategories: string[] = [];
  userName: string = '';
  notes: string = '';
  jobCategories: { [key: string]: string[] } = {};
  appliedJob: { title: string; req: string; status: string; date: string } | null = null;
  activeTab: string = 'active';
  activeJobs: any[] = [];
  activeIndex: number = 0;
  selectedJobTitle: string = '';
  
  selectedJobDescription: string[] | null = null;
  
  // Define the sections and their statuses
  sections: { [key: string]: boolean } = {
    'notifications': false,
    'applications': false
  };

  inactiveJobs: any[] = [];
  constructor(private lookupService: LookupService, private youthService: YouthServiceService,private router: Router, private authService: AuthService
  ) { }
  removeApplication() {
    // Logic to remove the job application
    console.log('Application removed');
    // You can update job status or perform any other action as needed
  }
  toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
    console.log(`${section} section toggled. Current state: ${this.sections[section] ? 'Open' : 'Closed'}`);
  }

  ngOnInit() {
    const youthIdString = localStorage.getItem('userId');
    const youthId = youthIdString ? parseInt(youthIdString, 10) : null;
  
    if (youthId !== null) {
      this.youthService.getAppliedJobById(youthId).subscribe(
        (response) => {
          console.log('API Response:', response);
          if (response.appliedJob && Array.isArray(response.appliedJob)) {
            const allJobs = response.appliedJob.map((jobEntry, index) => ({
              title: jobEntry.job,
              req: `REQ-${index + 1}`,
              status: jobEntry.status,
              date: new Date().toLocaleDateString(),
            }));
      
            this.activeJobs = allJobs.filter(job => job.status === 'waiting' || job.status === 'approved');
            this.inactiveJobs = allJobs.filter(job => job.status === 'rejected');
      
            this.appliedJob = this.activeJobs.find(job => job.status === 'approved') || null;
          } else {
            console.error('Unexpected appliedJob format:', response.appliedJob);
            this.activeJobs = [];
            this.appliedJob = null;
          }
        },
        (error) => {
          console.error('Error fetching applied jobs:', error);
        }
      
      );
    } else {
      console.error('Youth ID is null, cannot fetch applied job.');
    }
  
    // Fetch youth details and job categories...
  
  
    if (youthId !== null){
    this.youthService.getYouthById(youthId).subscribe(
      (response) => {
        if (response) {
          this.userName = response.firstNameEn +' '+ response.lastNameEn || 'Unknown'; // Youth's name
          this.jobStatus = response.status || ''; // Youth's overall status
          this.notes = response.notes || ''; // Youth's notes
        } else {
          console.error('Response is null or undefined for youth details.');
        }
      },
      (error) => {
        console.error('Error fetching youth details:', error);
      }
    );}
    this.lookupService.getJobCategories().subscribe(
      (data: any) => {
        if (data && data[0]?.categories) {
          this.jobCategories = data[0].categories;
        } else {
          console.error('Unexpected data format:', data);
        }
      },
      (error) => {
        console.error('Error fetching job categories:', error);
      }
    );
  }
  editProfile(): void {
    const userId = localStorage.getItem('userId'); // Get the user ID
    const role = localStorage.getItem('role'); // Get the user role
  
    if (userId && role) {
      if (role.toLowerCase() === 'employer') {
        this.router.navigate(['/employerprofile', userId]);
      } else if (role.toLowerCase() === 'youth') {
        this.router.navigate(['/youthprofile', userId]);
      } else {
        console.error('Unknown role, unable to navigate');
      }
    } else {
      console.error('User ID or role not found, cannot navigate');
    }
  }
  viewDetails(jobTitle: string): void {
    this.lookupService.getJobDescription(jobTitle).subscribe(
      (description) => {
        if (description.length > 0) {
          this.selectedJobTitle = jobTitle;
          this.selectedJobDescription = description;
          this.showdetailsPopup = true; // Reuse `showPopup` to control the modal visibility
        } else {
          console.error(`No description found for job title: ${jobTitle}`);
        }
      },
      (error) => {
        console.error('Error fetching job description:', error);
      }
    );
  }
  
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }
  onSelectCategory(category: string) {
    this.selectedCategory = category;
    this.subcategories = this.jobCategories[category] || [];
    console.log('Selected subcategories:', this.subcategories);
  }


  updateCategoryJob(id: number, appliedJob: string[]): void {
    if (!appliedJob) {
      console.error('Job category is required');
      return;
    }


    const payload = { appliedJob };

    this.youthService.updateYouthCategoryJob(id, payload).subscribe(
      (response) => {
        console.log(`Job Category updated to ${appliedJob} for youth with ID: ${id}`);

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

      const youthIdString = localStorage.getItem('userId');
      const youthId = youthIdString ? parseInt(youthIdString, 10) : null;

      if (youthId) {

        const selectedJobs = Array.isArray(this.selectedSubcategory)
          ? this.selectedSubcategory
          : [this.selectedSubcategory];

        const appliedJobs = selectedJobs.map((job: string) => ({
          job,
          status: 'waiting',
        }));


        console.log('Applied Jobs:', appliedJobs);


        this.youthService.updateYouthAppliedJobs(youthId, appliedJobs).subscribe({
          next: () => {
            console.log(`Applied jobs added successfully for Youth ID: ${youthId}`);
            this.updateCategoryJob(youthId, selectedJobs);
            this.showPopup = false;
            window.location.reload();

          },
          error: (err) => {
            console.error(`Error updating applied jobs for Youth ID: ${youthId}`, err);
          },
        });
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
  closedetailsPopup() {
    this.showdetailsPopup = false;
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
