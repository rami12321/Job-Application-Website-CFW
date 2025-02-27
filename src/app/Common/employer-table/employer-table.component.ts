
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-employer-table',
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
    TableModule,
    CommonModule,
    TableModule,
    MultiSelectModule,
    DetailsEmployerComponent
],
  providers: [YouthServiceService],
    templateUrl: './employer-table.component.html',
  styleUrl: './employer-table.component.css'
})

export class EmployerTableComponent implements OnInit {
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
  selectedDataScope = 'myArea';

  excludedColumns: string[] = [
    'signature',
    'id',
    'role',
    'profileImage',
    'active',
    'status',

  ];
  filteredCols: Column[] = []; // New array to hold filtered columns
  private appliedJobFilterSubject = new Subject<string>();

  constructor(
    private employerService: EmployerService,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef

  ) {
    this.appliedJobFilterSubject.pipe(debounceTime(300)).subscribe((filterValue) => {
      this.appliedJobFilter = filterValue;
    });
  }

  ngOnInit(): void {
    this.loadSelectedColumnsFromLocalStorage();
    this.setActiveTabFromLocalStorage();
    this.region = localStorage.getItem('adminArea') || ''; 
    console.log("Admin region set from localStorage:", this.region);
    console.log(this.savedColumns);
    this.fetchEmployerData();

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
    if (this.fetchedData == 'employer') {
      this.fetchEmployerData();
    } 
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
 
  clearFilter(): void {
    this.appliedJobFilter = ''; // Clear the filter input
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
  fetchEmployerData(): void {
    this.employerService.getAllEmployers().subscribe(
      (data: any[]) => {
        console.log('Fetched Employer Data:', data);
  
        let filteredData = this.active !== undefined
          ? data.filter((item) => item.active === this.active)
          : data;
  
        if (this.selectedDataScope === 'myArea' && this.region && this.region.trim() !== '') {
          filteredData = filteredData.filter((item) => 
            item.area && item.area.toLowerCase() === this.region.toLowerCase()
          );
        } else if (this.selectedDataScope === 'all') {
          console.log('Admin selected to view all data. No region filtering applied.');
        }
  
        filteredData = filteredData.filter((item) => {
          const matchesArea = this.selectedAreas.length === 0 || this.selectedAreas.includes(item.area);
          return matchesArea;
        });
  
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
  
          if (this.savedColumns) {
            this.savedColumns = this.cols;
          } else {
            this._selectedColumns = this.cols;
          }
        }
        console.log('Filtered Employer Data:', filteredData);

        this.employerList = filteredData;
        this.paginatedProducts = [...this.employerList]; // Spread operator forces detection
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error fetching employer data:', error);
      }
    );
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
  note: string = '';
  selectedYouth: any;
  showNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.note = youth.note || ''; // If there's an existing note, pre-fill the input
    this.noteDialogVisible = true;
  }
  //youth dialog
  youthDialog: boolean = false;
  updateActiveStatus(id: string, isActive: boolean): void {
    this.employerService.updateActiveStatus(id, isActive).subscribe(
      (response) => {
        console.log(`Active status updated to ${isActive} for youth with ID: ${id}`);

        // Re-fetch the data to reflect changes
        this.fetchEmployerData();
      },
      (error) => {
        console.error('Error updating active status:', error);
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
    this.employerDialogVisible = false;
    this.jobRequestDialogVisible = false;
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

}
