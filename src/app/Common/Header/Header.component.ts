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
  isMenuOpen = false; // Tracks mobile menu state
  dropdownOpen = false;
  userInitials: string = '';

  role=localStorage.getItem("userRole")

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const firstName = localStorage.getItem('firstName') || 'F';
    const lastName = localStorage.getItem('lastName') || 'N';
    this.userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Redirect to profile page, passing the user ID
      this.router.navigate(['/youthprofile', userId]);
    }
  }

}
