import { Routes } from '@angular/router';
import { LoginComponent } from './Common/Login/Login.component';
import { MainEmployerComponent } from './Employer/main-employer/main-employer.component';
import { SignUpYouthComponent } from './Youth/SignUp-Youth/SignUp-Youth.component';
import { AdminComponent } from './admin/admin.component';

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
    path:'admin',
    component: AdminComponent
  },
  {
    path:'admin',
    component: AdminComponent
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
    path: 'signup',
    component: SignUpYouthComponent, // Parent for steps

  },
];
