import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AccordionModule],
  templateUrl: './Dashboard-Admin.component.html',
  styleUrl: './Dashboard-Admin.component.css'
})
export class AdminDashboardComponent {

}
