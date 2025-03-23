import { Component } from '@angular/core';
import { FeaturesComponent } from '../features/features.component';
import { JobCategoriesComponent } from '../job-categories/job-categories.component';
import { FooterComponent } from '../Footer/Footer.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { RouterModule } from '@angular/router';
import { MainNavbarComponent } from '../main-navbar/main-navbar.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AnimatedStatComponent } from '../animated-stat/animated-stat.component';
import { AboutUsComponent } from '../about-us/about-us.component';

@Component({
    standalone: true,selector: 'app-home',
  
    imports: [FeaturesComponent, FooterComponent, StatisticsComponent, RouterModule, MainNavbarComponent, ContactFormComponent, AnimatedStatComponent, AboutUsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}


