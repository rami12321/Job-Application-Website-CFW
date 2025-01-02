import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/AuthService/auth-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router



@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule,] // Import CommonModule here
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;

  tabs: string[] = ['Youth', 'Employer']; // Tab names
  activeTabIndex: number = 0; // Active tab index (default is Employer)

  // Function to set the active tab
  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Function to get the label for the submit button
  getSubmitButtonLabel(): string {
    return `Login as ${this.tabs[this.activeTabIndex]}`;
  }

  email = '';
  userName='';
  password = '';
  loginError = '';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const role = this.tabs[this.activeTabIndex];
    this.authService.login(this.userName, this.password, role).subscribe(response => {
      if (response.success) {
        console.log(`Login successful! Role: ${response.role}`);


        // Redirect based on role
        if (response.role === 'Employer') {
          this.router.navigate(['/main-employer']); // Redirect to Employer dashboard
        } else if (response.role === 'Youth') {
          this.router.navigate(['/main-youth']); // Redirect to Youth dashboard
        }
      } else {
        this.loginError = response.message; // Display login error
        console.log(this.loginError)
      }
    });
  }

  ngOnInit() {
  }

}

