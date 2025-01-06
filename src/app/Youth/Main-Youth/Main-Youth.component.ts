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
  assignedYouths: AssignedYouth[] = [];

  selectedJobDescription: string[] | null = null;

  agreementText: string = `
UNITED NATIONS RELIEF AND WORKS AGENCY FOR PALESTINE REFUGEES IN THE NEAR EAST
SPECIAL AGREEMENT
This Agreement (the Agreement) made between:
The United Nations Relief and Works Agency for Palestine Refugees in the Near East (hereinafter the Agency or UNRWA)
And
[Beneficiary] (hereinafter the Beneficiary) whose details are indicated hereunder
((Each also a Party and, collectively, the Parties)
WHEREAS:
A. The Beneficiary has applied for an opportunity and wishes to participate in UNRWA's Cash for Work (CfW) Program:
B. The Beneficiary has met UNRWA's criteria for participating in the CfW Program; and
C. UNRWA wishes to provide the Beneficiary with on-the-job training based on the terms and conditions set forth in this Agreement.

NOW, THEREFORE, the Parties enjoying full legal capacity have mutually agreed as follows:
The role of UNRWA:

UNRWA's role shall be limited to the following activities:
1.1. Facilitating the relationship between the Beneficiary and the Employer by performing the matching process based on the information provided to UNRWA by both Parties in the Beneficiary's Application and Employer's ToR.
1.2. Providing the Beneficiary with accident insurance coverage, valid for the duration of the employment (40 working days of attendance within the 50th working day from commencement of the employment), also during the commuting homework.
1.3. The date of commencement of the employment shall be the date of the beneficiary's signature of this Agreement.
1.4. Reimbursing the Beneficiary for a lump sum of ($15) per working day (transportation and food arrangements to be made by each Beneficiary independently). This will be an equal amount for all Beneficiaries involved in the Project. Payment of reimbursements will be issued based on the Beneficiary's attendance sheet, monitored by the Employer and signed by both Parties. Entitlement to reimbursement shall be granted only if the Beneficiary attended at least 21 working days (out of overall working days of attendance) according to the Attendance sheet, of an amount proportioned to the working days attended. Drop-outs before this period shall be considered not entitled to any reimbursements whatsoever. This amount of $15/day is paid by UNRWA to the Beneficiary based on humanitarian aid, without this being considered as part of the contractual relationship which shall remain strictly limited between the Beneficiary and the Employer.
1.5. UNRWA shall not be a party to the contractual relationship established by this Agreement between the Parties. Hence, except as expressly agreed to by UNRWA under paragraphs 2 and 3 above solely for the benefit of the Beneficiary, UNRWA shall have no liability towards either Party, and both the Beneficiary and the Employer shall not make any claims whatsoever against UNRWA in connection with any arrangement to which this Agreement relates.
1.6. UNRWA shall have the right to request the Employer to provide any form of reporting on the implementation of the Project under this Agreement, and it shall have the right to do on-site inspections at any time when deemed necessary by UNRWA to appraise the Beneficiary's working conditions.
1.7. Nothing in or relating to this Project and/or Agreement shall be deemed a waiver, express or implied, of any of the privileges and immunities accorded to UNRWA in international law.
1.8. UNRWA may terminate this Agreement at its own discretion, without cause, at any time, by serving both the Beneficiary and Employer not less than 7 working days' prior notice in writing in this respect. Neither Party shall have the right to object or receive any compensation or amount whatsoever because of such termination. The termination of the Agreement shall entail the immediate termination of the contractual relationship between the Parties established pursuant to this Agreement.
The role of the beneficiary:

The Beneficiary shall agree on the Terms and Conditions of the Agreement and perform the following obligations:
2.1. Acknowledging and agreeing on the Employer's ToR.
2.2. Entering a contractual relationship with the Employer upon date of commencement of the employment (as per paragraph 1.3. of section 1. "The role of UNRWA") as stated in the "Employer's ToR" and in the "Beneficiary's application", for a maximum duration of 40 working days of attendance within the 50th working day from commencement of the employment, under the conditions of this Agreement.
2.3. Attending the workplace and taking up the activities as per the Terms and Conditions of this Agreement.
2.4. Acknowledging and agreeing on attending the workplace for a minimum of 35 hours per week and a maximum of 48 hours per week. Any possible arrangements among the Parties to extend the working hours beyond 48 hours per week shall be communicated to UNRWA in writing, signed by both Parties, and shall not be considered as part of this Agreement, therefore such possible extra working hours will not be covered by any accident insurance nor will be subject to any reimbursement by UNRWA.
2.5. Beneficiaries under 18 years of age should work for a maximum of 6 hours per day and should be provided with a one-hour break after 4 consecutive hours of work. No beneficiaries should work between the hours of 1900 and 0700, during rest periods or holidays/events that are time off for the employer.
2.6. The Beneficiary is entitled to maximum overall 10 days of non-paid leave. Leaving must be communicated by the Beneficiary to and approved by the Employer beforehand. The maximum number of days of leave granted to the Beneficiary shall comply with the criteria of attendance of 40 working days within the 50th working day from commencement of the employment for the Beneficiary to qualify for a Completion Certificate from UNRWA.
2.7. The Beneficiary must communicate in advance any absence to the Employer; however, the Beneficiary has the right to maximum 2 consecutive unjustified working days (and maximum 3 if counting non-working days too) of absence, for cases such as illness or cause of force majeure. In case further unjustified absence occurs and it is not communicated within the 3rd consecutive day (and within the 4th consecutive if counting non-working days too), UNRWA has the right to consider the case as drop-out and is entitled to terminate the contractual relationship, and the Beneficiary should not be entitled to any type of reimbursement. In this case, the Employer can accept the integration of a new beneficiary within the workplace.
2.8. In addition to the conditions stated in paragraphs 5 and 6 above, the Beneficiary's overall days of absence, including both approved leave and unjustified days of absence, shall not exceed 10 working days within the working days from commencement of the employment.
2.9. Acknowledging and abiding by the UNRWA Code of Ethics (attached to this Agreement). The UNRWA Code of Ethics shall also constitute an integral part of this Agreement.
2.10. Immediately reporting to UNRWA any violation and/or abuse under this Agreement and/or the Code of Ethics for the records.
2.11. Acknowledging that the abovementioned reimbursement is strictly limited to the amount of $15 per day, UNRWA will start processing the first payment to the Beneficiary at the end of the 21st day of work and against proof of satisfactory attendance, and then upon completion of the whole duration of employment period and against proof of satisfactory attendance (Attendance Sheet signed by both Parties of this Agreement). If the above conditions are satisfied, payment of reimbursements shall be proportional to number of working days attended.
2.12. Being fully responsible and liable for the obligations under this Agreement, including for any claims, damages, losses and liabilities of any kind or nature suffered by the Beneficiary or any other Party arising from acts or omissions attributable to any Party under this Agreement.
2.13. Except as expressly agreed to by UNRWA under paragraphs 2 and 3 under Section I above, releasing UNRWA from any claim or liability in connection with any arrangement to which this Agreement relates.
2.14. Acknowledging and agreeing that UNRWA may provide its donors with information relating to the Parties' identity, this Agreement, its contents and implementation.
2.15. Maintaining the confidentiality of the information related to this Agreement, the Beneficiary will not communicate, at any time, to any other person any confidential or other information known to him/her by reason of his/her association with UNRWA except with the explicit authorization of UNRWA. This provision shall survive the expiration or termination of this Agreement.
2.16. The required attendance for the Beneficiary shall be 37.5 hours per week for General Service and 42 hours for Manual Service.
2.17. Any absence from duty must have prior authorization from the Department/Division Head through the Beneficiary.
Role of employer:

The Employer shall agree on the Terms and Conditions of the Agreement and perform the following obligations:
3.1. Acknowledging and agreeing on the Beneficiary's Application.
3.2. Entering a contractual relationship with the Beneficiary upon date of commencement of employment (as per paragraph 1.3 of section 1. "The role of UNRWA") as stated in the "Employer's ToR" and in the "Beneficiary's application", for a maximum duration of 40 working days of attendance within the 50th working day from commencement of the employment, under the conditions of this Agreement.
3.3. Acknowledging and agreeing that the employer-employee contractual relationship under this Agreement shall be limited to the Beneficiary and Employer. UNRWA shall not be a party to the contractual relationship established by this Agreement between the Parties.
3.4. Availing the employment to the Beneficiary according to the Terms and Conditions of this Agreement, acknowledging and ensuring that the Beneficiary shall attend the workplace for a minimum of 35 hours per week and a maximum of 48 hours per week. Any possible arrangements among the Parties to extend the working hours beyond 48 hours per week shall be communicated to UNRWA in writing, signed by both Parties, and shall not be considered as part of this Agreement, therefore such possible extra working hours will not be covered by any accident insurance nor will be subject to any reimbursements by UNRWA.
3.5. Beneficiaries under 18 years of age should work for a maximum of 6 hours per day and should be provided with a one-hour break after 4 consecutive hours of work. No beneficiaries should work between the hours of 1900 and 0700, during rest periods or holidays/events that are time off for the employer.
3.6. Acknowledging that the Beneficiary is entitled to maximum 10 days of non-paid leave within the working day from commencement of the contractual relationship, according to the provisions of this Agreement, as stated in paragraph 5. and 6. of section II "The role of the Beneficiary".
3.7. Acknowledging and abiding by the UNRWA Code of Ethics (attached to this Agreement). The Code of Ethics shall also constitute an integral part of this Agreement.
3.8. Immediately report to UNRWA any violation and/or abuse under this Agreement and/or the UNRWA Code of Ethics for the records.
3.9. Acknowledging that the Employer shall not be entitled to any form of compensation or amount under this Agreement.
3.10. Providing to UNRWA with any form of reporting under the Agreement as required.
3.11. Being fully responsible and liable for the obligations under this Agreement, including for any claims, damages, losses and liabilities of any kind or nature suffered by the Employer or any other Party arising from acts or omissions attributable to any Party under this Agreement.
3.12. The Employer shall, in a timely manner, monitor and submit the attendance of the Beneficiary to UNRWA through an attendance sheet.
3.13. The Employer is responsible to ensure that all working security rules and conditions are followed, and that the employer shall remain responsible for the safety of the Beneficiary under this Agreement.
3.14. The Employer will ensure that the work performed by the Beneficiary remains the same as originally agreed upon between the Parties. The Employer shall sign the Completion Certificate as advised by UNRWA.
3.15. Releasing UNRWA from any claim or liability in connection with any arrangement to which this Agreement relates.
3.16. Acknowledging and agreeing that UNRWA may provide its donors with information relating to the Parties' identity, this Agreement, its contents, and implementation.
3.17. Maintaining the confidentiality of the information related to this Agreement. The Employer will not communicate, at any time, to any other person, any confidential or other information known to him/her by reason of his/her association with UNRWA except with the explicit authorization of UNRWA. This provision shall survive the expiration or termination of this Agreement.
`;

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
          console.log('Response from API:', response);

          if (response.appliedJobs && Array.isArray(response.appliedJobs)) {
            const mappedJobs = response.appliedJobs.map((jobEntry: any, index: number) => ({
              id: jobEntry.jobRequestId || null,
              title: jobEntry.job || `Unknown Job ${index + 1}`,
              req: `REQ-${index + 1}`,
              status: jobEntry.status || 'waiting',
              date: new Date().toLocaleDateString(),
            }));

            this.activeJobs = mappedJobs.filter(job => job.status === 'waiting' || job.status === 'approved');
            this.inactiveJobs = mappedJobs.filter(job => job.status !== 'approved' || job.status !== 'waiting' );
            this.appliedJob = this.activeJobs.find(job => job.status === 'approved') || null;

            console.log('Mapped Jobs:', mappedJobs);
            console.log('Active Jobs:', this.activeJobs);
            console.log('Inactive Jobs:', this.inactiveJobs);


            if (this.appliedJob && this.appliedJob.id) {
              
              this.jobRequestService.getJobById(this.appliedJob.id).subscribe(
                (jobDetails: Job) => {
                  console.log('Job Request Details:', jobDetails);
                  this.selectedJob = jobDetails;
                  this.detailsselectedJob = jobDetails

                  this.jobRequestService.getAssignedYouthsByJobId(this.appliedJob!.id).subscribe(
                    (assignedYouths: AssignedYouth[]) => {
                      console.log('Assigned Youths:', assignedYouths);



                      const specificAssignedYouth = assignedYouths.find(youth => Number(youth.id) === youthId);

                      console.log('Youth ID from localStorage:', youthId);
                      console.log('Youth ID from API:', assignedYouths.map(youth => youth.id));

                      if (specificAssignedYouth) {
                        console.log('Specific Assigned Youth:', specificAssignedYouth);
                        this.specificAssignedYouth = specificAssignedYouth;
                        this.startDate = this.specificAssignedYouth?.EmployerContract?.startDate || 'N/A';
                      } else {
                        console.warn('No assigned youth found matching the user ID.');
                        this.specificAssignedYouth = null;
                      }
                    },
                    (error: any) => {
                      console.error('Error fetching assigned youths:', error);
                    }
                  );
                },
                (error: any) => {
                  console.error('Error fetching job request details:', error);
                }
              );
            } else {
              console.warn('No approved job with a valid jobRequestId found.');
            }
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
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

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