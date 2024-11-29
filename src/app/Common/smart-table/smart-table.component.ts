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


  excludedColumns: string[] = ['status','confirmation','arabic','english','french','trainings','coverLetter','identityCard','registrationCard','degree','experienceDetails','experiences','requiredDocuments','seekingEmploymentDuration','trainingsAndSkills','password','confirmPassword', 'cv', 'alShifaaProof', 'fireProof', 'prcsProof'];
  filteredCols: Column[] = []; // New array to hold filtered columns

  constructor(private youthService: YouthServiceService) {}

  ngOnInit(): void {
    this.fetchYouthData(); // Fetch data from the service
  }




  fetchYouthData(): void {
    this.youthService.getAllYouth().subscribe(
      (data: any[]) => {
        console.log('Fetched Youth Data:', data);

        // Filter youthList by status if the `status` input is provided
        const filteredData = this.status
          ? data.filter((item) => item.status === this.status)
          : data;

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

          // Insert "Action" column at the desired position (e.g., 1st position)
          // const actionColumn = { field: 'action', header: 'Action' };
          // this.cols.unshift(actionColumn); // Add at the beginning

          // Initialize _selectedColumns with all columns except "Action"
          this._selectedColumns = this.cols.filter(col => col.field !== 'action');

          // Initialize _selectedColumns1 which will be used in ngModel
          // this._selectedColumns1 = this.cols.filter(col => col.field !== 'action');
        }

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
        return ['view', 'accept'];
      default:
        return ['view', 'pend'];
    }
  }


performAction(action: string, item: any): void {
  if (action === 'view') {
    console.log('View action for:', item);
  } else if (action === 'pend') {
    console.log('Pend action for:', item);
  } else if (action === 'accept') {
    console.log('Accept action for:', item);
  }
}
    representatives = [
    { name: 'Male' },
    { name: 'Female' },
  ];
filterByGender(selectedGenders: any[]): void {
  this.youthService.getAllYouth().subscribe((data: any[]) => {
    if (selectedGenders && selectedGenders.length > 0) {
      this.paginatedProducts = data.filter(youth =>
        selectedGenders.includes(youth.gender)
      );
    } else {
      // Reset to show all data if no gender is selected
      this.paginatedProducts = [...data];
    }
  });
}
editRow(rowData: any): void {
  console.log('Edit action triggered for:', rowData);
  // Add your logic for editing the row
}

deleteRow(rowData: any): void {
  console.log('Delete action triggered for:', rowData);
  // Add your logic for deleting the row
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
}


