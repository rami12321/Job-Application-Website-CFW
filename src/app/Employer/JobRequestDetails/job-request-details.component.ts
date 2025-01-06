import { AfterViewChecked, AfterViewInit, OnChanges, ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Job } from '../../Model/JobDetails';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import SignaturePad from 'signature_pad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Employer } from '../../Model/Employer';
import { EmployerService } from '../../Services/employer-service/employer-services.service';

@Component({
  selector: 'app-job-request-details',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FormsModule, PdfViewerModule],
  templateUrl: './job-request-details.component.html',
  styleUrl: './job-request-details.component.css',
})
export class JobRequestDetailsComponent  implements AfterViewInit, OnInit,AfterViewChecked, OnChanges{
  @Input() jobId: string | null = null;
  public jobRequest: Job | undefined;
  private userId: string | null = null;

  isContractModalOpen = false;
  agreementStartDate: string | null = null;
  isPdfModalOpen: boolean = false;
  storedPdfUrl: string | null = null;
  agreementEndDate: string | null = null;
  isApprovalModalOpen: boolean = false;
  selectedYouth: any | null = null;
  isEmployerContractModalOpen = false;
isYouthContractModalOpen = false;
public employer: Employer | undefined;
selectedContract: any = null;
  showConfirmationModal = false;
  public signatureImage: string | null = null;
  isSignatureModalOpen = false;
  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  isEditing: { [key: string]: boolean } = {};
  editModels: { [key: string]: any } = {};
  isModalOpen = false;
  modalImage: string = '';
  showSignatureWarning = false;
  isTermsModalOpen = false;
  isTermsAccepted = false;
  isEditingSignature = false;
  uploadedFileName: string | null = null;
  isDeleteModalOpen = false;
uploadedFileUrl: string | null = null;
  modalAction: string = '';
  selectedYouthName: string | null = null;
  isSubmitModalOpen = false;
  userRole: string | null = localStorage.getItem('role');
  currentPage = 1;
  itemsPerPage = 3;
  searchQuery = '';
  approvedCount: number = 0;
  isSubmitEnabled: boolean = false;
  paginatedAssignedYouths: any[] = [];
  isrevertModalOpen = false;
  isSignaturePadInitialized = false;
  completeConfirmationModal = false; // Track modal visibility

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
  constructor(
    private jobRequestService: JobRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private youthService: YouthServiceService,
    private cdr: ChangeDetectorRef,
    private employerService: EmployerService

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      console.log('Retrieved jobId from route:', jobId);
      const role = this.route.snapshot.queryParamMap.get('role') || localStorage.getItem('role');
      this.userRole = role;
      console.log('User role:', this.userRole);

      if (jobId) {
        this.jobId = jobId;
        this.fetchJobRequestDetails();
      } else {
        console.error('Invalid or missing jobId');
      }


        if (this.userId) {
          this.fetchEmployerDetails();}
    });
    this.updatePagination();
    if (!this.signatureImage) {
      this.showSignatureWarning = true;
      return;
    }

  }

  private fetchEmployerDetails(): void {
    this.employerService.getEmployerById(this.userId!).subscribe({
      next: (data: Employer) => {
        this.employer = data;
 // After employer data is fetched, load the profile image
      },
      error: (err) => {
        console.error('Error fetching employer data:', err);
      },
    });
  }

  confirmApproval(): void {
    if (this.selectedYouth) {
      if (this.modalAction === 'approve') {
        this.selectedYouth.action = 'approved';
      } else if (this.modalAction === 'reset') {
        this.selectedYouth.action = 'accepted';
      }

      this.jobRequestService
        .updateJob(this.jobId!, { assignedYouths: this.jobRequest!.assignedYouths })
        .subscribe({
          next: () => {
            console.log(`Youth status updated to: ${this.selectedYouth.action}`);
            this.fetchJobRequestDetails();
          },
          error: (err) => console.error('Error updating youth status:', err),
        });
      this.isApprovalModalOpen = false;

    }
  }

  submitContract() {
    if (!this.selectedYouth || !this.signatureImage || !this.agreementStartDate || !this.isTermsAccepted || !this.jobRequest) {
      console.error('All fields are required to submit the contract.');
      return;
    }

    const contractDetails = {
      startDate: this.agreementStartDate,
      signature: this.signatureImage,
      agreementAccepted: this.isTermsAccepted,
    };

    // Update the selected youth in the assignedYouths array
    this.jobRequest.assignedYouths = this.jobRequest?.assignedYouths?.map((youth) => {
      if (youth.id === this.selectedYouth.id) {
        return {
          ...youth,
          EmployerContract: contractDetails,
        };
      }
      return youth;
    });

    // Log to verify the updated job request structure
    console.log('Updated jobRequest:', this.jobRequest);

    this.jobRequestService
      .updateJob(this.jobId!, { assignedYouths: this.jobRequest.assignedYouths })
      .subscribe({
        next: (response) => {
          console.log('Contract saved successfully:', response);
          this.closeContractModal();
          this.fetchJobRequestDetails();

        },
        error: (err) => {
          console.error('Failed to save the contract:', err);
        },
      });
  }




  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && this.jobId) {
      this.fetchJobRequestDetails();
    }
    if (changes['userId'] && this.userId) {
      this.fetchEmployerDetails(); // Fetch data when userId changes
    }
  }

  fetchJobRequestDetails(): void {
    if (!this.jobId) {
      console.error('Missing jobId, cannot fetch data');
      return;
    }

    this.jobRequestService.getJobById(this.jobId).subscribe({
      next: (data: Job) => {
        console.log('Job request fetched successfully:', data);
        this.jobRequest = {
          ...data,
          assignedYouths: data.assignedYouths || [],
        };
        this.updatePagination();
        this.initializeRowStates();

      },
      error: (err) => {
        console.error('Error fetching job request:', err);
      },
    });
  }


  updateYouthStatus(youth: any, action: 'accepted' | 'rejected'): void {
    if (!this.jobRequest || !this.jobId) return;


    youth.action = action;


    const updatedYouth = {
      ...youth,
      status: action === 'accepted' ? 'approved' : 'rejected',
    };


    this.jobRequestService
      .updateJob(this.jobId, { assignedYouths: this.jobRequest.assignedYouths })
      .subscribe({
        next: () => console.log(`Youth status updated successfully to: ${action}`),
        error: (err) => console.error('Error updating youth status:', err),
      });
  }

  updateYouthWithWorkStatus(youthId: any, workStatus: boolean): void {
    this.youthService.getYouthById(youthId).subscribe({
      next: (youth) => {
        if (youth) {
          // Create the updated youth object with the new workStatus
          const updatedYouth = { ...youth, workStatus };

          // Update the youth record in the database (in youthdb.json)
          this.youthService.updateYouth(youthId, updatedYouth).subscribe({
            next: () => console.log(`Successfully updated workStatus for youth ID: ${youthId}`),
            error: (err) => console.error(`Error updating youth workStatus for ID: ${youthId}`, err),
          });
        } else {
          console.error(`Youth record not found for ID: ${youthId}`);
        }
      },
      error: (err) => console.error(`Error fetching youth data for ID: ${youthId}`, err),
    });
  }



  updateYouthAppliedJobs(
    youthId: any,
    currentJobTitle: string,
    newStatus: string,
    approvedJobRequestId?: string // Optional parameter for approved job request ID
  ): void {
    this.youthService.getYouthById(youthId).subscribe({
      next: (youth) => {
        if (youth && youth.appliedJob) {
          console.log('Fetched youth record:', youth);

          // Update the applied jobs array
          const updatedAppliedJobs = youth.appliedJob.map(
            (job: { job: string; status: string; jobRequestId?: string }) => {
              if (job.job === currentJobTitle) {
                console.log(`Updating job: ${job.job} to status: ${newStatus}`);
                return {
                  ...job,
                  status: newStatus,
                  jobRequestId: newStatus === 'approved' ? approvedJobRequestId : undefined, // Add jobRequestId only for approved jobs
                };
              } else if (job.status === 'waiting') {
                console.log(`Marking job: ${job.job} as rejected`);
                return { ...job, status: 'rejected' }; // Reject all other jobs with 'waiting' status
              }
              return job; // Return unchanged jobs
            }
          );

          // Create the updated youth object
          const updatedYouth = { ...youth, appliedJob: updatedAppliedJobs };
          console.log('Updated youth object:', updatedYouth);

          // Update the youth record in the database
          this.youthService.updateYouth(youthId, updatedYouth).subscribe({
            next: () =>
              console.log(`Successfully updated applied jobs for youth ID: ${youthId}`),
            error: (err) =>
              console.error(`Error updating youth record for ID: ${youthId}`, err),
          });
        } else {
          console.error(`Youth record or applied jobs not found for ID: ${youthId}`);
        }
      },
      error: (err) =>
        console.error(`Error fetching youth data for ID: ${youthId}`, err),
    });
  }
  markAsCompleted(): void {
    if (!this.jobRequest || !this.jobId) {
      console.error('Job request or job ID is undefined.');
      return;
    }

    const updatedJobRequest = {
      ...this.jobRequest,
      status: 'completed',
    };

    const safeJobId = this.jobId ?? '';

    // Update job request status
    this.jobRequestService.updateJob(safeJobId, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request marked as completed successfully.');

        // Process assigned youths
        if (this.jobRequest!.assignedYouths) {
          this.jobRequest!.assignedYouths.forEach((youth) => {
            this.youthService.getYouthById(youth.id).subscribe({
              next: (fetchedYouth) => {
                if (fetchedYouth) {
                  const approvedJob = fetchedYouth.appliedJob.find(
                    (job: any) => job.status === 'approved'
                  );

                  if (approvedJob) {
                    // Update the approved job's status to "completed"
                    approvedJob.status = 'completed';

                    // Remove other jobs from the appliedJob array
                    fetchedYouth.appliedJob = fetchedYouth.appliedJob.filter(
                      (job: any) => job.status === 'completed'
                    );

                    // Update the youth data
                    const updatedYouth = {
                      ...fetchedYouth,
                      workStatus: false,
                      beneficiary: true,
                    };

                    this.youthService.updateYouth(youth.id, updatedYouth).subscribe({
                      next: () =>
                        console.log(`Updated youth ID: ${youth.id} successfully.`),
                      error: (err) =>
                        console.error(`Error updating youth ID: ${youth.id}`, err),
                    });
                  }
                }
              },
              error: (err) =>
                console.error(`Error fetching youth data for ID: ${youth.id}`, err),
            });
          });
        }

        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: (err) => console.error('Error updating job request status:', err),
    });
  }


  openTermsModal() {
    this.isTermsModalOpen = true;
  }
  openEmployerContractModal(contract: any): void {
    this.selectedContract = contract;
    this.isEmployerContractModalOpen = true;
  }

  openYouthContractModal(contract: any): void {
    this.selectedContract = contract;
    this.isYouthContractModalOpen = true;
  }

  closeEmployerContractModal(): void {
    this.isEmployerContractModalOpen = false;
    this.selectedContract = null;
  }

  closeYouthContractModal(): void {
    this.isYouthContractModalOpen = false;
    this.selectedContract = null;
  }
  // Close the Terms Modal
  closeTermsModal() {
    this.isTermsModalOpen = false;
  }
  openPdfModal(fileUrl: string): void {
    this.storedPdfUrl = fileUrl; // Set the URL of the uploaded file
    this.isPdfModalOpen = true;  // Open the modal
  }

  // Method to close the modal
  closePdfModal(): void {
    this.isPdfModalOpen = false; // Close the modal
    this.storedPdfUrl = null;    // Clear the file URL
  }

  // Handle file selection and upload logic here
  onFileSelected(event: Event, youth: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      // Handle file upload logic (set URL, file name, etc.)
      youth.uploadedFileName = file.name; // Set the file name
      // Assuming you'll upload the file and get a URL back
      youth.uploadedFileUrl = URL.createObjectURL(file); // Temporary URL for local display
    }
  }

  openDeleteModal(youth: any): void {
    console.log('Opening delete modal for youth', youth);
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;
    this.isDeleteModalOpen = true;
    this.selectedYouth = youth;

    this.cdr.detectChanges();  // Manually trigger change detection

  }
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedYouthName = null;
  }
  opencompleteModal(): void {
    this.showConfirmationModal = true;
  }

  // Cancel and close the modal
  cancelcompleteModal(): void {
    this.completeConfirmationModal = false;
  }

  // Confirm completion
  confirmCompletion(): void {
    this.markAsCompleted();
    this.showConfirmationModal = false; // Close the modal
  }


  // Accept the Terms
  acceptTerms() {
    this.isTermsAccepted = true;
    this.closeTermsModal();
  }
  openRevertModal(youth: any): void {
    this.isrevertModalOpen = true;
    this.modalAction = 'reset';
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;
    this.selectedYouth = youth;
  }
  openContractModal(youth: any) {
    this.signatureImage = this.employer?.signature || null;

    this.isContractModalOpen = true;
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;

    this.selectedYouth = youth;
  }

  closeContractModal() {
    this.isContractModalOpen = false;
  }
  confirmRevert(): void {
    if (this.selectedYouth) {

      this.selectedYouth.action = 'accepted';


      this.jobRequestService
        .updateJob(this.jobId!, { assignedYouths: this.jobRequest!.assignedYouths })
        .subscribe({
          next: () => {
            console.log(`Youth status reverted to: ${this.selectedYouth.action}`);
            this.fetchJobRequestDetails();
            this.closeRModal();
          },
          error: (err) => {
            console.error('Error reverting youth status:', err);
            this.closeRModal();
          },
        });
    }
  }
  ngAfterViewInit(): void {
    // Initialize SignaturePad only when modal is shown
    this.isSignaturePadInitialized = false;
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

  deleteYouth(youth: any): void {
    const jobId = this.jobId; // Use the component's jobId
    if (!jobId) {
      console.error('Job ID is undefined. Cannot delete youth.');
      alert('An error occurred: Job ID is missing.');
      return;
    }

    const youthId = youth.id;

      this.jobRequestService.unassignYouthFromJobRequest(jobId, youthId).subscribe({
        next: () => {
          this.jobRequest!.assignedYouths = this.jobRequest!.assignedYouths!.filter(
            (y) => y.id !== youthId
          ); // Update the list locally
          this.updatePagination();
        },
        error: (err) => {
          console.error('Failed to delete youth:', err);
          alert('An error occurred while trying to delete the youth.');
        },
      });

  }

  onAgreementStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.value;

    this.agreementStartDate = date;

    // Calculate the end date (100 days after the start date)
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100);

    // Format the date as YYYY-MM-DD
    const year = endDate.getFullYear();
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const day = endDate.getDate().toString().padStart(2, '0');
    this.agreementEndDate = `${year}-${month}-${day}`;
  }

  closeApprovalModal(): void {
    this.isApprovalModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }
  openApprovalModal(youth: any, action: string): void {
    this.isApprovalModalOpen = true;
    this.modalAction = action;
    this.selectedYouthName = `${youth.firstName} ${youth.lastName}`;
    this.selectedYouth = youth;
  }
  closeRModal(): void {
    this.isrevertModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }
  closeModal(): void {
    this.isModalOpen = false;
    this.modalAction = '';
    this.selectedYouthName = '';
    this.selectedYouth = null;
  }


  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAssignedYouths = this.jobRequest?.assignedYouths?.slice(startIndex, endIndex) || [];
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil((this.jobRequest?.assignedYouths?.length || 0) / this.itemsPerPage);
  }

  searchAssignedYouths() {
    const query = this.searchQuery.toLowerCase();
    const filtered = this.jobRequest?.assignedYouths?.filter(
      (youth) =>
        youth.firstName.toLowerCase().includes(query) ||
        youth.lastName.toLowerCase().includes(query)
    );
    this.jobRequest!.assignedYouths = filtered || [];
    this.currentPage = 1;
    this.updatePagination();
  }
  get hasAssignedYouths(): boolean {
    return !!this.jobRequest?.assignedYouths?.length;
  }

  navigateToRole(role: string): void {
    localStorage.setItem('role', role);
    this.userRole = role;
    this.router.navigate([role === 'Admin' ? '/admin' : '/main-employer'], {
      queryParams: { role },
    });
  }

  updateRowStates(): void {
    if (this.jobRequest) {

      this.approvedCount = this.jobRequest.assignedYouths?.filter(
        (youth) => youth.action === 'approved'
      ).length || 0;

      console.log('Approved Youth Count (updateRowStates):', this.approvedCount);


      this.jobRequest.assignedYouths?.forEach((youth) => {
        youth.isDisabled =
          this.approvedCount >= this.jobRequest!.numEmployees && youth.action !== 'approved';
      });


      this.isSubmitEnabled = this.approvedCount > 0;
      console.log('Is Submit Enabled (updateRowStates):', this.isSubmitEnabled);
    }
  }

  checkSubmitCondition(): void {
    if (this.approvedCount >= this.jobRequest!.numEmployees) {
      this.submitJobRequests();
    } else {
      this.showConfirmationModal = true;
    }
  }

  confirmSubmit(): void {
    this.showConfirmationModal = false;
    this.submitJobRequests();
  }

  cancelSubmit(): void {
    this.showConfirmationModal = false;
  }

  submitJobRequests(): void {
    if (!this.jobRequest || !this.jobId) {
      console.error('Job request or job ID is undefined.');
      return;
    }

    // Get all the youths that are approved for this job request
    const updatedYouths =
      this.jobRequest.assignedYouths
        ?.filter((youth) => !(youth.isDisabled && youth.action !== 'approved'))
        .map((youth) => ({
          ...youth,
          status: youth.action === 'approved' ? 'approved' : youth.status,
        })) ?? [];

    const approvedYouths = updatedYouths.filter((youth) => youth.status === 'approved');

    // Update the current job request with the approved youths
    const updatedJobRequest = {
      ...this.jobRequest,
      assignedYouths: approvedYouths,
      status: 'in-progress',
    };

    // Ensure jobId is a string
    const safeJobIdForUpdate = this.jobId ?? '';

    // Update the current job request with the new youths
    this.jobRequestService.updateJob(safeJobIdForUpdate, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request submitted successfully.');
        updatedYouths.forEach((youth) => {
          const isApproved = youth.status === 'approved';

          // Update the workStatus directly in the youth record in the youthdb.json file
          if (isApproved) {
            this.updateYouthWithWorkStatus(youth.id, true); // Set workStatus to true for approved youth
          }

          this.updateYouthAppliedJobs(
            youth.id,
            this.jobRequest?.job || '',
            isApproved ? 'approved' : 'rejected',
            isApproved && this.jobId ? this.jobId : undefined // Ensure jobId is a string or undefined
          );
        });

        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: (err) => console.error('Error submitting job request:', err),
    });
  }




  initializeRowStates(): void {
    if (this.jobRequest) {
      this.approvedCount = this.jobRequest.assignedYouths?.filter(
        (youth) => youth.action === 'approved'
      ).length || 0;

      console.log('Approved Youth Count (initializeRowStates):', this.approvedCount);

      this.updateRowStates();

      this.isSubmitEnabled = this.approvedCount > 0;
      console.log('Is Submit Enabled (initializeRowStates):', this.isSubmitEnabled);
    }
  }


  toggleYouthStatus(youth: any, action: string | null): void {
    if (action) {
      this.updateYouthStatus(youth, action as 'accepted' | 'rejected');
    } else {
      youth.action = null;
      youth.status = 'waiting';


      if (this.jobRequest && this.jobId) {
        this.jobRequestService
          .updateJob(this.jobId, { assignedYouths: this.jobRequest.assignedYouths })
          .subscribe({
            next: () => console.log(`Youth status reset to 'waiting'`),
            error: (err) => console.error('Error resetting youth status:', err),
          });
      }
    }
  }



  submitJobRequest(): void {
    if (!this.jobRequest || !this.jobId) return;

    const updatedYouths = this.jobRequest.assignedYouths?.map((youth) => ({
      ...youth,
      status:
        youth.action === 'accepted'
          ? 'assigned'
          : youth.status === 'rejected'
            ? 'rejected'
            : youth.status,
    }));

    const updatedJobRequest = {
      ...this.jobRequest,
      assignedYouths: updatedYouths,
      status: 'assigned-E',
    };


    this.jobRequestService.updateJob(this.jobId, updatedJobRequest).subscribe({
      next: () => {
        console.log('Job request submitted successfully');
        this.fetchJobRequestDetails();
      },
      error: (err) => console.error('Error submitting job request:', err),
    });
  }


  isEmployer(): boolean {
    return this.userRole === 'Employer';
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin' || !this.userRole;
  }


  saveChanges(): void {
    if (!this.editModels) return;

    if (this.jobRequest) {
      Object.assign(this.jobRequest, this.editModels);
    }

    this.jobRequestService.updateJob(this.jobId!, this.editModels).subscribe({
      next: () => {
        console.log('Job request updated successfully');
        this.isEditing['details'] = false;
      },
      error: (err) => {
        console.error('Error updating job request:', err);
      },
    });
  }


}
