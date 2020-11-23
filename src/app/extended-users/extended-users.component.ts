import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  usersDataSource = new MatTableDataSource<User>();
  tableColumns = ['id', 'name', 'email','active', 'lastLogin', 'groups', 'perms'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usersService: UsersService) { }

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
}
