import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NotifierComponent } from './components/notifier/notifier.component';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WeekShiftsComponent } from './components/week-shifts/week-shifts.component';
import { EditpComponent } from './components/editp/editp.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { MyshiftsComponent } from './components/myshifts/myshifts.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';
import { AddShiftComponent } from './components/add-shift/add-shift.component';
import { AllshiftsComponent } from './components/allshifts/allshifts.component';


@NgModule({
  declarations: [
    AppComponent,
    NotifierComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    WeekShiftsComponent,
    EditpComponent,
    AllUsersComponent,
    MyshiftsComponent,
    EditShiftComponent,
    AddShiftComponent,
    AllshiftsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
