import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [CommonModule] // Import CommonModule here
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false; // Tracks mobile menu state

  role=localStorage.getItem("userRole")

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor() { }

  ngOnInit() {
  }

}
