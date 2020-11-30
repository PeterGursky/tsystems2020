import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Auth } from 'src/entities/auth';
import { UsersService } from 'src/services/users.service';
import { Login } from 'src/shared/auth.actions';
import { AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  auth: Auth = new Auth('Peter','upjs');
  hidePassword = true;
  
  constructor(private usersService: UsersService, 
              private router: Router,
              private store: Store) { }

  ngOnInit(): void {
  }

  submitForm() {
    this.store.dispatch(new Login(this.auth)).subscribe(
      () => {
        console.log("Udalosť prihlásenia skončila");
        this.router.navigateByUrl(
          this.store.selectSnapshot(AuthState.redirectUrl)
        );
      }
    );
    // this.usersService.login(this.auth).subscribe(
    //   success => {
    //     if (success) {
    //       console.log('token received:', success);
    //       this.router.navigateByUrl("/extended-users");
    //     }
    //   }
    // );
  }
  printError(value:any) {
    if (value) {
      if (value.required) {
        return "Vyžadovaná hodnota";
      }
      if (value.minlength) {
        return "Minimálna dĺžka je " + value.minlength.requiredLength + " a aktuálna je " 
              + value.minlength.actualLength;
      }
    }
  }

  get printAuth() {
    return JSON.stringify(this.auth);
  }
}
