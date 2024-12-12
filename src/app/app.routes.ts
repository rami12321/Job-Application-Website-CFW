import { Routes } from '@angular/router';
import { LoginComponent } from './Common/Login/Login.component';
import { SignUpYouthComponent } from './Youth/SignUp-Youth/SignUp-Youth.component';
import { MainEmployerComponent } from './Employer/main-employer/main-employer.component';
import { MainAdminComponent } from './Admin/Main-Admin/Main-Admin.component';
import { SignUpEmployerComponent } from './Employer/SignUp-Employer/SignUp-Employer.component';
import { YouthSignupDetailsComponent } from './Youth/Details-Youth/Detailsyouth.component';
import { MainYouthComponent } from './Youth/Main-Youth/Main-Youth.component';
import { DetailsEmployerComponent } from './Employer/Details-Employer/details-employer.component';
import { YouthprofileComponent } from '../app/Youth/youthprofile/youthprofile.component';
import { EmployerprofileComponent } from './Employer/employerprofile/employerprofile.component';
import { JobRequestComponent } from './Employer/job-request/job-request.component';
import { JobRequestTableComponent } from './Employer/job-request-table/job-request-table.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'youthprofile/:id', component: YouthprofileComponent },
  { path: 'job-request/:id', component: JobRequestComponent },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path:'main-admin',
    component: MainAdminComponent
  },
  {
    path:'job-request-table',
    component: JobRequestTableComponent
  },
  {
    path: 'main-employer',
    component: MainEmployerComponent,
  },
  {
    path: 'main-youth',
    component: MainYouthComponent,
  },
  { path: 'youthprofile/:id', component: YouthprofileComponent },
  { path: 'employerprofile/:id', component: EmployerprofileComponent },

  {
    path: 'signup-youth',
    component: SignUpYouthComponent, // Parent for steps
  },

  {
    path: 'signup-employer',
    component: SignUpEmployerComponent, // Parent for steps
  },
  { path: 'youthsignup-details', component: YouthSignupDetailsComponent }, // Add this route
  { path: 'details-employer', component: DetailsEmployerComponent },

{
  path: 'employerprofile',
  component: EmployerprofileComponent, // Parent for steps
},
  {
    path: 'youthprofile',
    component: YouthprofileComponent, // Parent for steps
  },
  {
    path: 'admin',
    component: MainAdminComponent, // Parent for steps
  }

  
];
