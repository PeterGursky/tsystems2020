import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { SnackbarService } from 'src/services/snackbar.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  userId: number;
  username: string;
  user: User;

  constructor(private route: ActivatedRoute, 
              private usersService: UsersService,
              private snackbarService: SnackbarService) { }

  ngOnInit(): void {
//    this.userId = this.route.snapshot.params["id"];
    this.route.paramMap.pipe(
      switchMap(paramMap => this.usersService.getUser(+paramMap.get("id"))))
      .subscribe(user => {
        this.userId = user.id;
        this.username = user.name;
        this.user = user;
      });
  }

  changeUser(user: User) {
    this.usersService.saveUser(user).subscribe(user => {
      this.snackbarService.successMessage("Používateľ " + user.name +" uložený");
    });
  }
}
