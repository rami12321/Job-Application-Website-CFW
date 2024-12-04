import { Component, Input, OnInit } from '@angular/core';
import { SmartTableComponent } from '../../Common/smart-table/smart-table.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from '../Dashboard-Admin/Dashboard-Admin.component';
import { v4 as uuidv4 } from 'uuid'; // Install UUID library for unique codes
import { HttpClient } from '@angular/common/http';
import { VerificationCodeService } from '../../Services/VerificationCode/verification-code.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-Main-Admin',
  standalone: true,
  imports: [SmartTableComponent,CommonModule,AdminDashboardComponent],
  templateUrl: './Main-Admin.component.html',
  styleUrls: ['./Main-Admin.component.css']
})
export class MainAdminComponent implements OnInit {
  @Input() status: string | undefined;
  showModal: boolean = false;  // Controls the visibility of the modal


  activeTab: string = 'dashboard';
  activeYouthTab: string = 'accepted';
  generatedCode: string = "";
  errorMessage: string | null = null;
  generatedCodes: string[] = []; // Store generated codes for display in a table


  constructor(private http: HttpClient, private codeService: VerificationCodeService, private dialog: MatDialog) { }


  generateCode() {
    this.codeService.generateCode().subscribe({
      next: (response) => {
        // The response will contain the generated code
        this.generatedCode = response.code;
        console.log('Verification code saved:', response);
  activeYouthTab: string = 'waiting';

        // Add the generated code to the list of generated codes
        this.generatedCodes.push(this.generatedCode);

        // Show success dialog with the generated code
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error saving code:', err);
      },
    });
  }

  // Delete a generated code from the table and database
  deleteCode(code: string) {
    this.codeService.deleteCode(code).subscribe({
      next: (response) => {
        console.log(response.message); // Log success message
        // Remove the code from the local list of generated codes
        this.generatedCodes = this.generatedCodes.filter(c => c !== code);
      },
      error: (err) => {
        console.error('Error deleting code:', err);
        this.errorMessage = 'Failed to delete the verification code.';
      },
    });
  }
  
  closeModal() {
    this.showModal = false;  // Close the modal
  }

  // Generate a random 6-digit code (or use backend's logic)
  private generateUniqueCode(): string {
    const min = 100000;
    const max = 999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }
  ngOnInit() {
  }

  changeYouthTab(tab: string): void {
    this.activeYouthTab = tab;
  }
  changeTab(tab: string): void {
    this.activeTab = tab;
  }

}
