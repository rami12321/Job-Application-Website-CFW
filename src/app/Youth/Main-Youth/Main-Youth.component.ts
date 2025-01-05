import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/auth-service.service';
import { Job } from '../../Model/JobDetails';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { AssignedYouth } from '../../Model/assignedYouth';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-Main-Youth',
  templateUrl: './Main-Youth.component.html',
  standalone: true,
  styleUrls: ['./Main-Youth.component.css'],
  imports: [FormsModule, CommonModule, MultiSelectModule, ReactiveFormsModule, AccordionModule],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainYouthComponent implements OnInit {
  jobStatus: string = '';
  mobilePhone: string = '';
  isDetailsModalOpen: boolean = false;

  signatureImage: string | null = null;
  isSignatureModalOpen = false;
  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  showdetailsPopup: boolean = false;
  showPopup: boolean = false;
  isSignaturePadInitialized = false;

  showNote: boolean = false;
  isTermsAccepted = false;
  selectedJob: Job | null = null;
  detailsselectedJob: Job | null = null;
  selectedCategory: string = '';
  isContractModalOpen = false;
  startDate:string='';
  agreementStartDate: string | null = null;
  agreementEndDate: string | null = null;
  isTermsModalOpen = false;
  specificAssignedYouth: AssignedYouth | null = null;

  selectedSubcategory: string = '';
  mainCategories: string[] = [];
  subcategories: string[] = [];
  userName: string = '';
  fullName: string='';
  notes: string = '';
  jobCategories: { [key: string]: string[] } = {};
  appliedJob: { title: string; req: string; status: string; date: string, id: string } | null = null;
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
  constructor(private lookupService: LookupService, private youthService: YouthServiceService, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef, private jobRequestService: JobRequestService,

  ) { }
  removeApplication() {

    console.log('Application removed');

  }
  toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
    console.log(`${section} section toggled. Current state: ${this.sections[section] ? 'Open' : 'Closed'}`);
  }
  openTermsModal() {
    this.isTermsModalOpen = true;
  }
  acceptTerms() {
    this.isTermsAccepted = true;
    this.closeTermsModal();
  }

  closeTermsModal() {
    this.isTermsModalOpen = false;
  }
  ngAfterViewInit(): void {
    // Initialize SignaturePad only when modal is shown
    this.isSignaturePadInitialized = false;
  }

  ngOnInit() {
    const youthIdString = localStorage.getItem('userId');
    const youthId = youthIdString ? parseInt(youthIdString, 10) : null;

    if (youthId !== null) {

      this.youthService.getAppliedJobById(youthId).subscribe(
        (response) => {

          if (response.appliedJobs && Array.isArray(response.appliedJobs)) {
            // Map over the applied jobs
            const allJobs = response.appliedJobs.map((jobEntry, index) => ({
              title: jobEntry.job,
              req: `REQ-${index + 1}`,
              status: jobEntry.status || 'waiting',
              date: new Date().toLocaleDateString(),
            }));

            // Separate jobs into active and inactive
            this.activeJobs = allJobs.filter(job => job.status === 'waiting' || job.status === 'approved');
            this.inactiveJobs = allJobs.filter(job => job.status === 'rejected');

            this.appliedJob = this.activeJobs.find(job => job.status === 'approved') || null;



          } else {
            console.error('Unexpected appliedJobs format:', response.appliedJobs);
            this.activeJobs = [];
            this.inactiveJobs = [];
          }
        },
        (error) => {
          console.error('Error fetching applied jobs:', error);
          this.activeJobs = [];
          this.inactiveJobs = [];
        }
      );


      this.youthService.getYouthById(youthId).subscribe(
        (response) => {
          if (response) {
            this.fullName = response.firstNameEn + ' ' +response.fatherNameEn + ' ' +response.lastNameEn
            this.userName = response.firstNameEn + ' ' + response.lastNameEn || 'Unknown';
            this.jobStatus = response.status || '';
            this.notes = response.notes || '';
          } else {
            console.error('Response is null or undefined for youth details.');
          }
        },
        (error) => {
          console.error('Error fetching youth details:', error);
        }
      );


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
    } else {
      console.error('Youth ID is null, cannot fetch applied jobs.');
    }
  }

  openDetailsModal(job: any): void {
    this.isDetailsModalOpen = true;
    this.selectedJob = job;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedJob = null;
  }
  ngAfterViewChecked(): void {
    // Ensure the SignaturePad is initialized when the modal is opened and the view is fully loaded
    if (this.isSignatureModalOpen && !this.isSignaturePadInitialized) {
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
      this.isSignaturePadInitialized = true; // Mark as initialized
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  openSignaturePad(): void {
    this.isSignatureModalOpen = true;
    this.isSignaturePadInitialized = false; // Reset initialization flag
  }
  saveSignature(): void {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
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

  submitContract() {
    // Ensure all required fields are present before proceeding
    if (
      !this.specificAssignedYouth ||
      !this.mobilePhone ||
      !this.signatureImage ||
      !this.isTermsAccepted
    ) {
      console.error('All fields are required to submit the youth contract.');
      return;
    }

    // Create the YouthContract object
    const youthContract = {
      mobilePhone: this.mobilePhone,
      startDate: this.startDate,
      signature: this.signatureImage,
      agreementAccepted: this.isTermsAccepted,
    };

    // Update the specific assigned youth's YouthContract
    this.specificAssignedYouth = {
      ...this.specificAssignedYouth,
      YouthContract: youthContract,
    };

    // Update the assignedYouths in the job request
    if (this.appliedJob && this.appliedJob.id) {
      this.jobRequestService.getAssignedYouthsByJobId(this.appliedJob.id).subscribe(
        (assignedYouths: (AssignedYouth | null)[]) => {
          // Filter out null values to ensure we have only valid AssignedYouth objects
          const validAssignedYouths: AssignedYouth[] = assignedYouths.filter(
            (youth): youth is AssignedYouth => youth !== null
          );

          // Check for required values
          if (!this.mobilePhone  || !this.signatureImage || !this.isTermsAccepted) {
            console.error('All fields are required to submit the Youth Contract.');
            alert('Please fill in all required fields.');
            return;
          }

          // Map over the valid assigned youths and update the specific one
          const updatedAssignedYouths = validAssignedYouths.map((youth) => {
            if (youth.id === this.specificAssignedYouth!.id) {
              return {
                ...youth,
                YouthContract: {
                  mobilePhone: this.mobilePhone,
                  startDate: this.startDate!,
                  signature: this.signatureImage!, // Ensure not null
                  agreementAccepted: this.isTermsAccepted,
                },
              };
            }
            return youth;
          });

          // Submit the updated assigned youths array to the job request service
          this.jobRequestService
            .updateJob(this.appliedJob!.id, { assignedYouths: updatedAssignedYouths })
            .subscribe({
              next: (response) => {
                console.log('Youth contract saved successfully:', response);
                alert('Youth contract submitted successfully!');
                this.closeContractModal();
              },
              error: (err) => {
                console.error('Failed to save the youth contract:', err);
                alert('Failed to save the youth contract. Please try again.');
              },
            });
        },
        (error: any) => {
          console.error('Error fetching assigned youths:', error);
        }
      );

    } else {
      console.error('No valid applied job found to update.');
    }
  }

  onAgreementStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.value;

    this.agreementStartDate = date;


    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100);


    const year = endDate.getFullYear();
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const day = endDate.getDate().toString().padStart(2, '0');
    this.agreementEndDate = `${year}-${month}-${day}`;
  }

  openContractModal(job: any): void {
    console.log('Opening Contract Modal', job);

    this.isContractModalOpen = true;
    this.cdr.detectChanges();
  }
  closeContractModal() {
    this.isContractModalOpen = false;
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
          this.showdetailsPopup = true;
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
