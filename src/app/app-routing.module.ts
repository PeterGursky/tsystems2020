import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { MyPreloadingStrategyService } from 'src/guards/my-preloading-strategy.service';
import { C404Component } from './c404/c404.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';

const routes:Routes = [
  { path: 'groups', 
    loadChildren: () => import('../modules/groups/groups.module').then(mod => mod.GroupsModule),
    canLoad: [AuthGuard],
    data: { preload: true }
  },
  { path: 'users', component: UsersComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
  { path: 'users/add', component: UserAddComponent },
  { path: 'extended-users', component: ExtendedUsersComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full'},
  { path: '**', component: C404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    preloadingStrategy: MyPreloadingStrategyService
  }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
