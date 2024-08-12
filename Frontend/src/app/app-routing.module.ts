import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EditpComponent } from './components/editp/editp.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AddShiftComponent } from './components/add-shift/add-shift.component';
import { MyshiftsComponent } from './components/myshifts/myshifts.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';
import { AllshiftsComponent } from './components/allshifts/allshifts.component';

const routes: Routes = [
  {path:'',redirectTo:'register',pathMatch:'full'},
  {path:"register",component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'edit',component:EditpComponent},
  {path:'allUsers',component:AllUsersComponent},
  {path:'addShift',component:AddShiftComponent},
  {path:'myShifts',component:MyshiftsComponent},
  {path:'edit-shift',component:EditShiftComponent},
  {path:'allShifts',component:AllshiftsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
