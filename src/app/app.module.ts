import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { C404Component } from './c404/c404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { GroupsToStringPipe } from '../pipes/groups-to-string.pipe';
import { RegisterComponent } from './register/register.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserEditChildComponent } from './user-edit-child/user-edit-child.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    C404Component,
    NavbarComponent,
    ExtendedUsersComponent,
    GroupsToStringPipe,
    RegisterComponent,
    ConfirmDialogComponent,
    UserEditComponent,
    UserEditChildComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
