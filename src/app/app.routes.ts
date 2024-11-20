import { Routes } from '@angular/router';
import { LoginComponent } from './Common/Login/Login.component';
import { MainEmployerComponent } from './Employer/main-employer/main-employer.component';
import { SignUpYouthComponent } from './Youth/SignUp-Youth/SignUp-Youth.component';

export const routes: Routes = [

  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'main-employer',
    component: MainEmployerComponent
  },
  {
    path:'main-youth',
    component: SignUpYouthComponent
  },

];
