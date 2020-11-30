import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Login } from './auth.actions';

export interface AuthModel {
  username: string;
  token: string;
}

@State<AuthModel>({
  name: 'auth',
  defaults: { username: null, token: null }
})
@Injectable()
export class AuthState {

  @Action(Login)
  login(ctx: StateContext<AuthModel>, action: Login) {
    console.log("spracovavam udalost Login pre meno: " + action.auth.name);
    ctx.setState({
      username: action.auth.name,
      token: Math.floor(Math.random() * 100000) + ""
    });
  }
}