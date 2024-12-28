import { Component } from '@angular/core';
import { FeaturesComponent } from '../features/features.component';
import { JobCategoriesComponent } from '../job-categories/job-categories.component';
import { FooterComponent } from '../footer/footer.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeaturesComponent,JobCategoriesComponent,FooterComponent ,StatisticsComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
