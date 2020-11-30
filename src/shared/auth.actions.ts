import { Auth } from 'src/entities/auth';

export class Login {
  static readonly type= "[Login Page] login";
  constructor(public auth: Auth){}
}

export class Logout {
  static readonly type="[NavBar Page] logout";
}

export class OldTokenLogout {
  static readonly type="[UsersService] old token logout";
}

export class UrlAfterLogin {
  static readonly type="[AuthGuard] redirect url after login"
  constructor(public url: string){}
}