import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
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
  imports: [SmartTableComponent, CommonModule, AdminDashboardComponent],
  templateUrl: './Main-Admin.component.html',
  styleUrls: ['./Main-Admin.component.css']
})
export class MainAdminComponent implements OnInit, OnDestroy {
  @Input() status: string | undefined;
  showModal: boolean = false;  // Controls the visibility of the modal


  activeTab: string = 'dashboard';
  activeYouthTab: string = 'waiting';
  activeYouthTab1: string = 'waiting-E';
  activeEmployerTab:string='active';
  generatedCode: string = "";
  errorMessage: string | null = null;
  generatedCodes: string[] = []; // Store generated codes for display in a table


  constructor(private http: HttpClient, private codeService: VerificationCodeService, private dialog: MatDialog) { }

  ngOnDestroy(): void {
    // Clear localStorage when leaving the Admin component
    localStorage.removeItem('role');
    console.log('Admin component destroyed, role removed from localStorage.');
  }
  generateCode() {
    this.codeService.generateCode().subscribe({
      next: (response) => {
        // The response will contain the generated code
        this.generatedCode = response.code;
        console.log('Verification code saved:', response);

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
    // Load saved tab states from localStorage on initialization
    const savedTab = localStorage.getItem('activeTab');
    const savedYouthTab = localStorage.getItem('activeYouthTab');
    const savedYouthTab1 = localStorage.getItem('activeYouthTab1');
    const savedEmployerTab = localStorage.getItem('activeEmployerTab');

    if (savedTab) {
      this.activeTab = savedTab;
    }
    if (savedYouthTab) {
      this.activeYouthTab = savedYouthTab;
    }
    if (savedYouthTab1) {
      this.activeYouthTab1 = savedYouthTab1;
    };
    if (savedEmployerTab) {
      this.activeEmployerTab = savedEmployerTab;
    };
    localStorage.setItem('role', 'admin');
    localStorage.setItem('authenticated', 'true');
  }

  changeYouthTab(tab: string): void {
    this.activeYouthTab = tab;
    localStorage.setItem('activeYouthTab', tab); // Save youth tab state to localStorage
  }
  changeYouthTab1(tab: string): void {
    this.activeYouthTab1 = tab;
    localStorage.setItem('activeYouthTab1', tab); // Save youth tab state to localStorage
  }
  changeEmployerTab(tab: string): void {
    this.activeEmployerTab = tab;
    localStorage.setItem('activeEmployerTab', tab); // Save youth tab state to localStorage
  }


  changeTab(tab: string): void {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab); // Save main tab state to localStorage
  }
}
