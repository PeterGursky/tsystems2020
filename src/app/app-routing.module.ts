import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { C404Component } from './c404/c404.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';

const routes:Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full'},
  { path: '**', component: C404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
