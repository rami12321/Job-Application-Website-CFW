import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { ButtonModule } from 'primeng/button';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthSignupDetailsComponent } from '../../Youth/Details-Youth/Detailsyouth.component';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { DetailsEmployerComponent } from '../../Employer/Details-Employer/details-employer.component';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { Job } from '../../Model/JobDetails';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';
import { CheckboxModule } from 'primeng/checkbox';
import { debounceTime, Subject } from 'rxjs';

interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-youth-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TableModule,
    CheckboxModule,
    InputTextModule,
    PaginatorModule,
    MultiSelectModule,
    DialogModule,
    ButtonModule,
    YouthSignupDetailsComponent,
 
    TableModule,
    CommonModule,
    TableModule,
    MultiSelectModule,



  ],
  providers: [YouthServiceService],  templateUrl: './youth-table.component.html',
  styleUrl: './youth-table.component.css'
})

export class YouthTableComponent implements OnInit {
  @Input() status: string | undefined;
  @Input() region: string = '';

  @Input() active: boolean | undefined;
  @Input() fetchedData: string | undefined;
  youthsNotes: { name: string; notes: string }[] = [];
  youthDialogVisible = false; // Controls dialog visibility
  assignedYouthDialogVisible=false;
  youths: any[] = []; // Stores fetched youths
  selectedYouths: any[] = []; // Selected youths for assignment
  assignedYouths: any[] = []; // Youths fetched from the backend
  unassignedYouths: any[] = []; // Youths fetched from the backend
  activeTab:string=''
  combinedYouths: any[] = []; // Combination of assigned and selected
  selectedJob: string = '';
  currentEmployerId: string = '';
  currentJob: string = ''; // Stores the current job being ass
  youthList: any[] = [];
  assignedYouthList: any[] = [];
  employerList: any[] = [];
  employerDialogVisible = false;
  jobRequestDialogVisible = false;
  youthSignupDialogVisible = false;
  cols: Column[] = [];
  _selectedColumns: Column[] = [];
  savedColumns: Column[] = [];
  paginatedProducts: any[] = [];
  rowsPerPage = 10;
  jobs: Job[] = [];
  selectedGender: string[] = [];
  rowData: any = {}; // Or use the appropriate type for your data
  areas: string[] = [];
  majors: string[] = [];
  genders: string[] = [];
  educationLevels: string[] = [];
  selectedMajors: string[] = []; // Define selectedMajors
  selectedAreas: string[] = []; // Define selectedMajors
  selectedEducationLevels: string[] = []; // Define selectedMajors
  nationalityOptions: string[] = [];
  selectedNationalities: string[] = [];
  selectedIsEdited: string[] = [];
  selectedIsBeneficiary: string[] = [];
  allProducts: any[] = []; // Array to hold all data
  appliedJobFilter: string = '';

  excludedColumns: string[] = [
    'workStatus',
    'active',
    'assignedYouths',
    'signature',
    'registrationStatus',
    'emergencyPhone',
    'emergencyRelation',
    'jobOpportunitySource',
    'employmentOpportunities',
    'aboutYourself',
    'placedByKfw',
    'kfwYear',
    'innovationLabGraduate',
    'innovationLabGradtype',
    'employed',
    'isPrcsVolunteer',
    'isFireBrigadesVolunteer',
    'isAlShifaaVolunteer',
    'disability',
    'disabilityTypes',
    'disabilitySupport',
    'notes',
    'role',
    'id',
    'headfa',
    'question2',
    'status',
    'confirmation',
    'arabic',
    'english',
    'french',
    'trainings',
    'coverLetter',
    'identityCard',
    'registrationCard',
    'degree',
    'experienceDetails',
    'experiences',
    'requiredDocuments',
    'seekingEmploymentDuration',
    'trainingsAndSkills',
    'password',
    'confirmPassword',
    'cv',
    'alShifaaProof',
    'fireProof',
    'prcsProof',
  ];
  filteredCols: Column[] = []; // New array to hold filtered columns
  private appliedJobFilterSubject = new Subject<string>();

  constructor(
    private youthService: YouthServiceService,
    private employerService: EmployerService,
    private JobRequestService: JobRequestService,
    private lookupService: LookupService

  ) {
    this.appliedJobFilterSubject.pipe(debounceTime(300)).subscribe((filterValue) => {
      this.appliedJobFilter = filterValue;
      this.fetchYouthData();
    });
  }

  ngOnInit(): void {
    this.loadSelectedColumnsFromLocalStorage();
    this.setActiveTabFromLocalStorage();
    this.region = localStorage.getItem('adminArea') || ''; 
    console.log("Admin region set from localStorage:", this.region);
    console.log(this.savedColumns);


      this.fetchYouthData();
   
    this.lookupService.getLookupData().subscribe(
      (data) => {
        console.log('Lookup Data:', data); // Log the entire response
        this.allProducts = data; // Initialize with all data

        this.areas = (data.areas || []).map((area: any) => area.name);
        this.majors = data.majors || [];
        this.genders = data.genderOptions || [];
        this.educationLevels = data.educationLevels || [];
        this.nationalityOptions = data.nationalityOptions || [];

        console.log('Areas:', this.areas);
        console.log('Majors:', this.majors);
        console.log('Genders:', this.genders);
        console.log('educationLevels:', this.educationLevels);
        console.log('nationalityOptions:', this.nationalityOptions);
      },
      (error) => {
        console.error('Error fetching lookup data:', error);
      }
    );
  }


  setActiveTabFromLocalStorage(): void {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      // Set the status based on the active tab
      this.activeTab = activeTab;
    }
  }
  resetSelectedColumns() {
    localStorage.removeItem('selectedColumns');

   
   
      this.fetchYouthData();
   
  }
  loadSelectedColumnsFromLocalStorage() {
    const storedColumns = JSON.parse(
      localStorage.getItem('selectedColumns') || '[]'
    );
    if (storedColumns.length) {
      this.cols = storedColumns;
    }
  }

  saveSelectedColumnsToLocalStorage() {
    localStorage.setItem('selectedColumns', JSON.stringify(this.cols));
  }
  formatDate(dateString: string): string {
    if (!dateString) {
      return 'N/A'; // Handle missing dates gracefully
    }

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  filteredData: any[] = []; // Holds the filtered data
  fetchYouthData(): void {
    this.youthService.getAllYouth().subscribe(
      (data: any[]) => {
        console.log('Fetched Youth Data:', data);
  
        // Save all data for use in filters
        this.allProducts = data;
  
        this.youthList = data.map((item) => ({
          ...item,
          appliedJobText: Array.isArray(item.appliedJob)
            ? item.appliedJob.map((job: any) => job.job || '').join(', ')
            : '',
        }));
        console.log('Processed Youth List:', this.youthList);
  
        // Step 1: Filter by `status` if provided
        let filteredData = this.status
          ? data.filter((item) => item.status === this.status)
          : data;
  
          if (this.region && this.region.trim() !== '') {
            filteredData = filteredData.filter((item) => {
              return item.area && item.area.toLowerCase() === this.region.toLowerCase();
            });
          } else {
            console.log("No region filtering applied; region is empty or undefined.");
          }
  
        // Step 2: Apply other filters for gender, major, area, education levels, etc.
        filteredData = filteredData.filter((item) => {
          const matchesGender =
            this.selectedGender.length === 0 ||
            this.selectedGender.includes(item.gender);
          const matchesMajor =
            this.selectedMajors.length === 0 ||
            this.selectedMajors.includes(item.major);
          const matchesArea =
            this.selectedAreas.length === 0 ||
            this.selectedAreas.includes(item.area);
          const matchesEducationLevels =
            this.selectedEducationLevels.length === 0 ||
            this.selectedEducationLevels.includes(item.educationLevel);
          const matchesNationalityOptions =
            this.selectedNationalities.length === 0 ||
            this.selectedNationalities.includes(item.nationality);
          const matchesIsEdited =
            this.selectedIsEdited === null ||
            this.selectedIsEdited.length === 0 ||
            item.isEdited === this.selectedIsEdited;
          const matchesIsBeneficiary =
            this.selectedIsBeneficiary === null ||
            this.selectedIsBeneficiary.length === 0 ||
            item.beneficiary === this.selectedIsBeneficiary;
          const matchesAppliedJob =
            !this.appliedJobFilter ||
            (item.appliedJob || []).some((job: any) =>
              (job.job || '').toLowerCase().includes(this.appliedJobFilter.toLowerCase())
            );
  
          return (
            matchesGender &&
            matchesMajor &&
            matchesArea &&
            matchesEducationLevels &&
            matchesNationalityOptions &&
            matchesIsEdited &&
            matchesIsBeneficiary &&
            matchesAppliedJob
          );
        });
  
        // Configure columns dynamically if filtered data is available
        if (filteredData.length > 0) {
          const filteredColumns = Object.keys(filteredData[0]).filter(
            (key) => !this.excludedColumns.includes(key)
          );
          this.cols = filteredColumns.map((key) => ({
            field: key,
            header: this.capitalize(key),
          }));
  
          const savedColumns = localStorage.getItem('selectedColumns');
          if (savedColumns) {
            this._selectedColumns = JSON.parse(savedColumns);
            this.cols = [...this._selectedColumns];
          } else {
            this._selectedColumns = this.cols;
            this.cols = [...this._selectedColumns];
          }
        }
  
        // Update the youth list and pagination
        this.youthList = filteredData;
        this.filteredData = [...this.youthList];
        this.paginatedProducts = this.youthList;
        console.log(this.paginatedProducts.length);
      },
      (error) => {
        console.error('Error fetching youth data:', error);
      }
    );
  }
  
  clearFilter(): void {
    this.appliedJobFilter = ''; // Clear the filter input
    this.fetchYouthData(); // Reload the data without the filter
  }
  filterAppliedJob(event: Event): void {
    console.log('event'+event)
    const inputElement = event.target as HTMLInputElement;
    const keyword = inputElement?.value ? String(inputElement.value).toLowerCase() : ''; // Ensure it's a string

    console.log('Keyword:', keyword); // Debugging

    if (!Array.isArray(this.allProducts)) {
      console.error('allProducts is not an array:', this.allProducts);
      return;
    }

    this.paginatedProducts = this.allProducts.filter((product: any) =>
      product.appliedJob?.some((job: any) =>
        String(job.job).toLowerCase().includes(keyword)
      )
    );

    console.log('Filtered paginatedProducts:', this.paginatedProducts);
  }
  onAppliedJobFilterChange(value: string): void {
    this.appliedJobFilterSubject.next(value);
  }

  isEditedOptions = [
    { label: 'All', value: null },
    { label: 'Edited', value: true },
    { label: 'Not Edited', value: false },
  ];
  dropdownStyle = {
    background: 'white',
    border: '1px solid #ddd',
    'border-radius': '8px',
    'box-shadow': '0 2px 6px rgba(0, 0, 0, 0.1)',
  };
  onColumnChange(selectedColumns: Column[]): void {
    this.selectedColumns = selectedColumns;
  }

  set selectedColumns(columns: Column[]) {
    this._selectedColumns = columns;
    this.saveSelectedColumnsToLocalStorage(); // Ensure the columns are saved
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  capitalize(str: string): string {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1')
    );
  }

  getActionsForRow(status: string ,active:boolean): string[] {
    // Return different actions based on the row's status
    if(active==true){
      return ['view','deactivate']
    }else if(active==false){
      return ['view','activate']

    }else{

    switch (status) {
      case 'accepted':
        return ['view', 'pend'];
      case 'rejected':
        return ['view', 'pend'];
      case 'pending':
        return ['view', 'accept', 'reject', 'notes'];
      case 'waiting':
        return ['view', 'accept', 'reject', 'pend'];
      case 'waiting-E':
        return ['view', 'assign', 'reject'];
      case 'assigned':
        return ['view', 'assign'];
      default:
        return ['view', 'delete'];
    }
  }

  }

  performAction(action: string, item: any): void {
    if (action === 'view') {
      console.log('View action for:', item);

    } else if (action === 'pend') {
      this.updateStatus(item.id, 'pending');
    } else if (action === 'accept') {
      this.updateStatus(item.id, 'accepted');
    } else if (action === 'reject') {
      this.updateStatus(item.id, 'rejected');
    }
  }


  note: string = '';
  selectedYouth: any;
  showNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.note = youth.note || ''; // If there's an existing note, pre-fill the input
    this.noteDialogVisible = true;
  }
  updateIsEdited(id: any): void {
    // Call the service to update the `isEdited` field to `false`
    this.youthService.updateYouthIsEdited(id, false).subscribe(
      (response) => {
        console.log(`Youth with ID ${id} marked as not edited`);

        // Optionally, you can fetch the updated data after the status change
        this.fetchYouthData();
      },
      (error) => {
        console.error('Error updating isEdited status:', error);
      }
    );
  }


  //youth dialog
  youthDialog: boolean = false;

  updateStatus(id: number, newStatus: string): void {
    this.youthService.updateYouthStatus(id, newStatus).subscribe(
      (response) => {
        console.log(`Status updated to ${newStatus} for youth with ID: ${id}`);

        // Re-fetch the data to reflect changes
        this.fetchYouthData();
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }

  paginate(event: any): void {
    const { first, rows } = event;
    this.paginatedProducts = this.youthList.slice(first, first + rows);
  }

  visible: boolean = false;
  dialogVisible: boolean = false; // To show/hide the dialog
  noteDialogVisible: boolean = false; // To show/hide the dialog
  noYouthMessage: string = '';

  selectedYouthId: number | null = null;
  showDialog(youthId: number, activeTab: string): void {
    this.selectedYouthId = youthId;

    // Reset all dialog visibility states
    this.youthSignupDialogVisible = false;

    // Show the appropriate dialog based on the active tab
    switch (activeTab) {
      case 'employer':
        this.employerDialogVisible = true;
        break;
      case 'job-request':
        this.jobRequestDialogVisible = true;
        break;
      case 'youthsignup':
        this.youthSignupDialogVisible = true;
        break;
    }
  }

  clearSelectedYouthId(): void {
    this.selectedYouthId = null; // Reset when dialog is closed
  }

  updateNotes(youthId: any, newNotes: string): void {
    // Check if new notes are not empty
    if (newNotes.trim()) {
      // Call the service to update notes for the specific youth
      this.youthService.updateYouthNotes(youthId, newNotes).subscribe(
        (response) => {
          console.log(`Notes updated for youth with ID: ${youthId}`);
          // Re-fetch the data to reflect the updated notes
          this.fetchYouthData();
          this.updateStatus(youthId, 'pending');
        },
        (error) => {
          console.error('Error updating notes:', error);
        }
      );
    } else {
      console.warn('Notes cannot be empty');
    }
  }
  fetchNotesById(youthId: number): void {
    this.youthService.getYouthNotesById(youthId).subscribe(
      (response) => {
        console.log(`Notes for youth with ID ${youthId}:`, response.notes);

        // You can perform additional operations here, such as displaying the notes in a dialog
        this.note = response.notes || ''; // If a note exists, store it for display
        this.noteDialogVisible = true; // Open the dialog to show the note
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
  }


  displayNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.fetchNotesById(youth.id); // Fetch notes when opening the dialog
  }

  showYouthDialog(job: string, selectedJob: string): void {
    this.selectedJob = selectedJob;
    this.currentJob = job; // Store the current job being assigned
    this.selectedYouths = []; // Reset selectedYouths for this dialog
    this.youthService.getYouthByJob(job).subscribe({
      next: (response: any) => {
        console.log('Response from getYouthByJob:', response); // Log the response for debugging

        // Filter youths with workStatus === false
        const filteredYouths = (response.youths || []).filter((youth: any) => !youth.workStatus);

        // Transform youths to include a label for display
        this.youths = filteredYouths.map((youth: any) => ({
          id: youth.id,
          name: youth.name,
          beneficiary: youth.beneficiary,
          label: `${youth.name} (${youth.id})${
            youth.beneficiary ? ' ✅ (Beneficiary)' : ''
          }`, // Add icon and text if beneficiary
        }));

        console.log('Filtered and transformed youths array:', this.youths); // Log the transformed array
        this.youthDialogVisible = true; // Open the dialog
      },
      error: (error) => {
        console.error('Error fetching youths:', error);
      },
    });
  }

}
