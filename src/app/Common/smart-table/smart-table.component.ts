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
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TableModule,
    InputTextModule,
    PaginatorModule,
    MultiSelectModule,DialogModule, ButtonModule  ],
  providers: [YouthServiceService],
  templateUrl: './smart-table.component.html',
  styleUrl: './smart-table.component.css',
})
export class SmartTableComponent implements OnInit {
  @Input() status: string | undefined;

  youthList: any[] = [];
  cols: Column[] = [];
  _selectedColumns: Column[] = [];
  _selectedColumns1: Column[] = [];
  paginatedProducts: any[] = [];
  rowsPerPage = 10;
  selectedGender: string[] = [];
  rowData: any = {}; // Or use the appropriate type for your data
  areas: any[] = [];
  majors: string[] = [];
  genders: string[] = [];
  educationLevels: string[] = [];
  selectedMajors: string[] = []; // Define selectedMajors
  selectedAreas: string[] = []; // Define selectedMajors
  selectedEducationLevels: string[] = []; // Define selectedMajors
  nationalityOptions:string[]=[];
  selectedNationalities:string[]=[]
  excludedColumns: string[] = ['role','id','headfa','question2','status','confirmation','arabic','english','french','trainings','coverLetter','identityCard','registrationCard','degree','experienceDetails','experiences','requiredDocuments','seekingEmploymentDuration','trainingsAndSkills','password','confirmPassword', 'cv', 'alShifaaProof', 'fireProof', 'prcsProof'];
  filteredCols: Column[] = []; // New array to hold filtered columns

  constructor(private youthService: YouthServiceService,
    private lookupService: LookupService

  ) {}

  ngOnInit(): void {
    this.fetchYouthData(); // Fetch data from the service
    this.lookupService.getLookupData().subscribe(
      (data) => {
        console.log('Lookup Data:', data); // Log the entire response

        this.areas = data.areas || [];
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




  fetchYouthData(): void {
    this.youthService.getAllYouth().subscribe(
      (data: any[]) => {
        console.log('Fetched Youth Data:', data);

        // Step 1: Filter by `status` if provided
        let filteredData = this.status
          ? data.filter((item) => item.status === this.status)
          : data;

        // Step 2: Apply filters for gender, major, and area
        filteredData = filteredData.filter((item) => {
          const matchesGender =
            this.selectedGender.length === 0 || this.selectedGender.includes(item.gender);
          const matchesMajor =
            this.selectedMajors.length === 0 || this.selectedMajors.includes(item.major);
          const matchesArea =
            this.selectedAreas.length === 0 || this.selectedAreas.includes(item.area.name);
          const matchesEducationLevels =
            this.selectedEducationLevels.length === 0 || this.selectedEducationLevels.includes(item.educationLevels);
          const matchesNationalityOptions =
            this.selectedNationalities.length === 0 || this.selectedNationalities.includes(item.nationalityOptions);

          return matchesGender && matchesMajor && matchesArea && matchesEducationLevels && matchesNationalityOptions;
        });

        // Step 3: Configure columns dynamically if filtered data is available
        if (filteredData.length > 0) {
          // Exclude unwanted columns
          const filteredColumns = Object.keys(filteredData[0]).filter(
            (key) => !this.excludedColumns.includes(key)
          );

          // Map filtered columns to the format expected by PrimeNG
          this.cols = filteredColumns.map((key) => ({
            field: key,
            header: this.capitalize(key),
          }));

          // Initialize _selectedColumns with all columns except "Action"
          this._selectedColumns = this.cols.filter(col => col.field !== 'action');
        }

        // Step 4: Update youth list and paginated products
        this.youthList = filteredData;
        this.paginatedProducts = this.youthList.slice(0, this.rowsPerPage);
      },
      (error) => {
        console.error('Error fetching youth data:', error);
      }
    );
  }

  // Capitalize column headers for display
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  }

  getActionsForRow(status: string): string[] {
    // Return different actions based on the row's status
    switch (status) {
      case 'accepted':
        return ['view', 'pend'];
      case 'rejected':
        return ['view', 'pend'];
      case 'pending':
        return ['view', 'accept','reject'];
      case 'waiting':
        return ['view', 'accept','reject','pend'];
      default:
        return ['view', 'pend'];
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
  selectedYouth: any;  // Store selected youth's data
  dialogVisible: boolean = false;  // To show/hide the dialog
  showDialog(action: string, product: any) {
    if (action === 'view') {
      this.selectedYouth = { ...product };  // Assign the selected product's data to selectedYouth
      this.dialogVisible = true;  // Open the dialog
    }
  }

  loadLookupData(): void {
    this.lookupService.getLookupData().subscribe((data) => {
      this.areas = data.areas || [];
      this.majors = data.majors || [];
      this.genders = data.genderOptions || [];
      this.educationLevels = data.educationLevels || [];
      this.nationalityOptions = data.nationalityOptions || [];
    });
  }

}


