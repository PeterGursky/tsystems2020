import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups/groups.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupsListComponent } from './groups-list/groups-list.component';


@NgModule({
  declarations: [GroupsComponent, GroupEditComponent, GroupsListComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
