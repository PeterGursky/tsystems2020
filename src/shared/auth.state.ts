import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersService } from 'src/services/users.service';
import { Login, Logout, OldTokenLogout, UrlAfterLogin } from './auth.actions';

const DEFAULT_REDIRECT = "/extended-users"

export interface AuthModel {
  username: string;
  token: string;
  redirectAfterLogin: string;
}

@State<AuthModel>({
  name: 'auth',
  defaults: { username: null, token: null, redirectAfterLogin: DEFAULT_REDIRECT }
})
@Injectable()
export class AuthState {

  @Selector()
  static username(currentState: AuthModel) {
    return currentState.username;
  }

  @Selector()
  static redirectUrl(currentState: AuthModel) {
    return currentState.redirectAfterLogin;
  }

  @Selector([state => state.auth.username])
  static usernameOnly(username: string) {
    return username;
  }

  constructor(private usersService: UsersService){}

  ngxsOnInit() {
    this.usersService.checkToken().subscribe();
  }

  @Action(Login)
  login(ctx: StateContext<AuthModel>, action: Login) {
    console.log("spracovavam udalost Login pre meno: " + action.auth.name);
    return this.usersService.login(action.auth).pipe(
      tap(token => {
        ctx.patchState({
          username: action.auth.name,
          token
        });    
      })
    );
  }

  @Action([Logout, OldTokenLogout])
  logout(ctx: StateContext<AuthModel>, action: Logout | OldTokenLogout) {
    const token = ctx.getState().token;
    ctx.patchState({
      username: null,
      token: null,
      redirectAfterLogin: DEFAULT_REDIRECT
    });
    if (action instanceof Logout)
      return this.usersService.logout(token);
  }

  @Action(UrlAfterLogin)
  setUrlAfterLogin(ctx: StateContext<AuthModel>, action: UrlAfterLogin) {
    ctx.patchState({
      redirectAfterLogin: action.url
    });
  }
}