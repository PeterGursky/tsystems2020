import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  selectedUser: User; // = {name: 'xxx', email :'eee', password: ''};
  title = 'Zoznam používateľov';
  users = [ new User('Anna', 'anna@anna.sk'),
            new User('Jozef', 'jozef@anna.sk'), 
            new User('Milan', 'milan@gmail.com', 3)];
//  users$ : Observable<User[]>;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
//    this.users = this.usersService.getUsersLocalSynchronne();
//      this.users$ = this.usersService.getUsers();
  this.usersService.getUsers().subscribe( 
    (u:User[]) => { this.users = u },
    error => console.log("Server je nedostupný"),
    () => console.log("HTTP komunikácia skončila"));
}

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
