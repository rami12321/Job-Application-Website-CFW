// src/app/admin-login/admin-login.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/AuthService/auth-service.service';
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit{
  showPassword: boolean = false;
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    const role = 'admin';
    this.authService.login(this.username, this.password, role).subscribe((response) => {
      console.log('Full login response:', response); // Check the complete response object
      if (response.success) {
        // Adjust based on the structure of your response:
        const admin = response.admin || response; // for example, if the admin object is nested
        console.log(`Login successful! Role: ${admin.role}`);
        
        // Store details if available
        localStorage.setItem('adminName', admin.fullNameEnglish || '');
        localStorage.setItem('adminArea', admin.area || '');
        localStorage.setItem('role', admin.role || '');
  
        this.router.navigate(['/admin']);
      } else {
        this.loginError = response.message;
        console.error(this.loginError);
      }
    });
  }
  
  ngOnInit(): void {}

}
