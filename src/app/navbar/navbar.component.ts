import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UsersService } from 'src/services/users.service';
import { Logout } from 'src/shared/auth.actions';
import { AuthModel, AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;
//  @Select(AuthState) authState$ : Observable<AuthModel>;
//  @Select(state => state.auth.username) username$: Observable<string>;
  @Select(AuthState.usernameOnly) username$: Observable<string>;

  constructor(private usersService: UsersService, 
              private router: Router,
              private store: Store) { }

  ngOnInit(): void {
//    this.usersService.loggedUser().subscribe(changedUser => this.username = changedUser)
//    this.authState$.subscribe(authState => this.username = authState.username);
      this.username$.subscribe(u => this.username = u);
  }

  logout() {
    //this.usersService.logout();
    this.store.dispatch(new Logout()).subscribe(
        () => this.router.navigateByUrl("/login")
    );
  }
}
