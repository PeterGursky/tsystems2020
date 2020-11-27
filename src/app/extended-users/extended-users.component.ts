import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  usersDataSource = new MatTableDataSource<User>();
  tableColumns = ['id', 'name', 'email','active', 
                  'lastLogin', 'groups', 'perms', 'actions'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usersService: UsersService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe( 
      (u:User[]) => { this.usersDataSource.data = u });
    }

  ngAfterViewInit(): void {
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
      this.usersDataSource.sortingDataAccessor = (user: User, headerName:string) => {
        switch(headerName) {
          case "groups":
            return user.groups[0] ? user.groups[0].name : 'zzzzzz';
          case "perms":
            return user.groups[0] ? user.groups[0].permissions[0] : 'zzzzzz';
          default:
            return user[headerName];
        }
      };
      this.usersDataSource.filterPredicate = (user: User, filter: string) => {
        if (user.name.toLowerCase().includes(filter)) {
          return true;
        }
        for (let group of user.groups) {
          if (group.name.toLowerCase().includes(filter))
            return true;
          if (group.permissions.some(perm => perm.toLowerCase().includes(filter)))
            return true;
        }
        return false;
      }
  }

  applyFilter(value:string) {
    this.usersDataSource.filter = value.trim().toLowerCase();
    this.paginator.firstPage();
  }

  deleteUser(user: User) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, { data: {
      title: "Mazanie používateľa",
      message: "Naozaj chcete vymazať používateľa " + user.name + "?"
    }});
    dialog.afterClosed().subscribe( del => {
      if (del) {
        this.usersService.deleteUser(user.id).subscribe( ok => {
          if (ok) {
            this.usersDataSource.data = this.usersDataSource.data.filter(u => u.id !== user.id);
          }
        });    
      }
    })
  }
}
