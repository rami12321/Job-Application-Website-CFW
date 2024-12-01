import { Routes } from '@angular/router';
import { LoginComponent } from './Common/Login/Login.component';
import { SignUpYouthComponent } from './Youth/SignUp-Youth/SignUp-Youth.component';
import { MainEmployerComponent } from './Employer/main-employer/main-employer.component';
import { MainAdminComponent } from './Admin/Main-Admin/Main-Admin.component';
import { SignUpEmployerComponent } from './Employer/SignUp-Employer/SignUp-Employer.component';
import { YouthSignupDetailsComponent } from './Youth/SignUp-Youth-Details/youthsignup-details/youthsignup-details.component';

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
    component: SignUpYouthComponent,
  },
  {
    path: 'signup-youth',
    component: SignUpYouthComponent, // Parent for steps
  },
  {
    path: 'signup-employer',
    component: SignUpEmployerComponent, // Parent for steps
  },
  { path: 'youthsignup-details', component: YouthSignupDetailsComponent }, // Add this route


  {
    path: 'admin',
    component: MainAdminComponent, // Parent for steps
  }
];
