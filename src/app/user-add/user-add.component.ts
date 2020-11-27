import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { SnackbarService } from 'src/services/snackbar.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  constructor(private usersService:UsersService, 
              private snackbarService:SnackbarService) { }

  ngOnInit(): void {
  }
  
  addUser(user: User) {
    this.usersService.saveUser(user).subscribe(user => {
      this.snackbarService.successMessage("Používateľ " + user.name +" pridaný");
    });
  }
}
