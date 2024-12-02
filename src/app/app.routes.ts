import { Routes } from '@angular/router';
import { LoginComponent } from './Common/Login/Login.component';
import { SignUpYouthComponent } from './Youth/SignUp-Youth/SignUp-Youth.component';
import { MainAdminComponent } from './Admin/Main-Admin/Main-Admin.component';
import { YouthSignupDetailsComponent } from './Youth/Details-Youth/Detailsyouth.component';
import { MainEmployerComponent } from './Employer/Main-Employer/Main-Employer.component';
import { SignUpEmployerComponent } from './Employer/SignUp-Employer/SignUp-Employer.component';
import { MainYouthComponent } from './Youth/Main-Youth/Main-Youth.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path:'main-admin',
    component: MainAdminComponent
  },
  {
    path: 'main-employer',
    component: MainEmployerComponent,
  },
  {
    path: 'main-youth',
    component: MainYouthComponent,
  },
  {
    path: 'signup-youth',
    component: SignUpYouthComponent, // Parent for steps
  },

  {
    path: 'SignUp-Employer',
    component: SignUpEmployerComponent, // Parent for steps
  },
  {
    path: 'details-youth',
    component: YouthSignupDetailsComponent
  }, // Add this route


  {
    path: 'admin',
    component: MainAdminComponent, // Parent for steps
  }
];
