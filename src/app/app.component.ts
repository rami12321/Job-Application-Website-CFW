import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Common/Header/Header.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent, ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KFW';

  get showHeader(): boolean {
    // Add your condition for showing the header
    return !location.pathname.includes('login') && !location.pathname.includes('signup-youth') && !location.pathname.includes('youthsignup-details') && !location.pathname.includes('signup-employer')&& !location.pathname.includes('details-employer') && !location.pathname.includes('home') ;
  }
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
}).catch((err) => console.error(err));
