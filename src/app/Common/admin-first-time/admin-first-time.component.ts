import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/AuthService/auth-service.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-first-time',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-first-time.component.html',
  styleUrl: './admin-first-time.component.css'
})
export class AdminFirstTimeComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  adminFound: any = null;
  step: number = 1; // Step 1: verify email, Step 2: set password
  loading: boolean = false; // For showing the loading indicator

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  checkEmail(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.authService.checkAdminEmail(this.email).subscribe((result) => {
      this.loading = false;
      if (!result.exists) {
        this.errorMessage = 'Admin with this email does not exist.';
      } else if (result.alreadyHasPassword) {
        this.errorMessage = 'This admin already has a password. Please use the login page.';
      } else {
        this.adminFound = result.admin;
        this.step = 2; // Proceed to password setup
      }
    });
  }

  setPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (!this.newPassword.trim()) {
      this.errorMessage = 'Password cannot be empty.';
      return;
    }
    if (!this.adminFound) {
      this.errorMessage = 'No admin found.';
      return;
    }
    this.authService.setAdminPassword(this.adminFound.id, this.newPassword).subscribe((result) => {
      if (result.success) {
        this.successMessage = 'Password set successfully. Redirecting...';
        // Redirect to the admin page after a short delay.
        setTimeout(() => {
          this.router.navigate(['/main-admin']);
        }, 2000);
      } else {
        this.errorMessage = result.message || 'Failed to set password.';
      }
    });
  }
}
