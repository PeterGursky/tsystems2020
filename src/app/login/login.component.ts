import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/entities/auth';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  auth: Auth = new Auth('Peter','upjs');
  hidePassword = true;
  
  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  submitForm() {
    this.usersService.login(this.auth).subscribe(
      success => {
        if (success) {
          console.log('token received:', success);
          this.router.navigateByUrl("/extended-users");
        }
      }
    );
  }

  get printAuth() {
    return JSON.stringify(this.auth);
  }
}
