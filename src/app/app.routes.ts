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
import { JobRequestComponent } from './Employer/JobRequestEdit/job-request.component';
import { JobRequestDetailsComponent } from './Employer/JobRequestDetails/job-request-details.component';
import { candeactivateAdminGuard } from './guards/candeactivate-admin.guard';
import { HomeComponent } from './Common/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'youthprofile/:id', component: YouthprofileComponent },
  { path: 'job-request/:id', component: JobRequestComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path:'main-admin',
    component: MainAdminComponent,
    canDeactivate: [candeactivateAdminGuard] // Use the guard here

  },
  {
    path: 'job-request-details/:id',
    component: JobRequestDetailsComponent,
  },
  {
    path: 'job-request-details',
    component: JobRequestDetailsComponent,
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
    path: 'main-youth/:id',
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
  { path: 'youthsignup-details/:id', component: YouthSignupDetailsComponent }, // Add this route

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
