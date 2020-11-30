import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
  {path: '', component: GroupsComponent,
   canActivate: [AuthGuard],
   children: [
     {path: 'list', component: GroupsListComponent},
     {path: 'edit', component: GroupEditComponent}
   ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
