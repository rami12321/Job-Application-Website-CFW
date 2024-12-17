import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/auth-service.service';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [CommonModule] // Import CommonModule here
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false; 
  dropdownOpen = false;
  userInitials: string = '';
  profileImage: string | null = null; // Holds profile image if available

  role=localStorage.getItem("userRole")

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const firstName = localStorage.getItem('firstName') || 'F';
    const lastName = localStorage.getItem('lastName') || 'N';
    this.userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    this.profileImage = localStorage.getItem('profileImage') || null; // Load profile image if available

  }



  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    console.log(this.userInitials)
  }

  logout(): void {
    // Clear user session or token
    localStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  }

  editProfile(): void {
    const userId = localStorage.getItem('userId'); // Get the user ID
    const role = localStorage.getItem('role'); // Get the user role
  
    if (userId && role) {
      if (role.toLowerCase() === 'employer') {
        this.router.navigate(['/employerprofile', userId]);
      } else if (role.toLowerCase() === 'youth') {
        this.router.navigate(['/youthprofile', userId]);
      } else {
        console.error('Unknown role, unable to navigate');
      }
    } else {
      console.error('User ID or role not found, cannot navigate');
    }
  }
  

}
