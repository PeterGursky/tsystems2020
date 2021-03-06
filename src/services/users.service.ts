import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subscriber, throwError } from 'rxjs';
import { User } from 'src/entities/user';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Auth } from 'src/entities/auth';
import { SnackbarService } from './snackbar.service';
import { Group } from 'src/entities/group';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/shared/auth.state';
import { OldTokenLogout } from 'src/shared/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = [ new User('AnnaService', 'anna@anna.sk'),
            new User('JozefService', 'jozef@anna.sk'), 
            new User('MilanService', 'milan@gmail.com', 3)];
  private serverUrl = "http://localhost:8080/";
//  private token:string;
//  private loggedUserSubscriber: Subscriber<string>;
//   public get token(): string {
//     return localStorage.getItem('token');
//   }

//   public set token(t: string) {
//     if (t)
//       localStorage.setItem('token', t);
//     else
//       localStorage.removeItem('token');  
//   }

//   private get user(): string {
//     return localStorage.getItem('user');
//   }

//   private set user(u: string) {
// //    this.loggedUserSubscriber.next(u);
//     if (u)
//       localStorage.setItem('user', u);
//     else
//       localStorage.removeItem('user');  
//   }


  constructor(private http: HttpClient, private snackbarService: SnackbarService, private store: Store) { }

  get user() {
    return this.store.selectSnapshot(AuthState.username);
  }

  get token() {
    return this.store.selectSnapshot(state => state.auth.token);
  }

  login(auth:Auth):Observable<string> {
    return this.http.post(this.serverUrl + 'login', auth, {responseType:"text"})
    .pipe(
      tap(token => {
        // this.token = token;
        // this.user = auth.name;
        this.snackbarService.successMessage("úspešné prihlásenie používateľa " + auth.name);
      }),
      catchError(error => this.processHttpError(error))
    );
  }
  
  userConflicts(user: User): Observable<string[]> {
    return this.http.post<string[]>(this.serverUrl + "user-conflicts", user).pipe(
      catchError(error => this.processHttpError(error))
    )
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.serverUrl + "register", user).pipe(
      catchError(error => this.processHttpError(error))
    )
  }

  logout(token: string): Observable<void> {
      return this.http.get(this.serverUrl + 'logout/' + token).pipe(
        mapTo(undefined),
        catchError(error => this.processHttpError(error))
      )
  }

  checkToken(): Observable<void> {
    if (this.token == null) {
      return of(undefined);
    }
    return this.http.get(this.serverUrl+ "check-token/" + this.token).pipe(
      mapTo(undefined),
      catchError(error => this.processHttpError(error))
    )
  }

  loggedUser(): Observable<string> {
    return new Observable(subscriber => {
//      this.loggedUserSubscriber = subscriber;
      subscriber.next(this.user);
    });
  }

  getUsersLocalSynchronne() : User[] {
    return this.users;
  }

  getUsersLocalAsychynchonne() : Observable<User[]> {
    return of(this.users);
  }

  getUsers() : Observable<User[]> {
    return this.http.get(this.serverUrl + "users").pipe(
      map(jsonusers => this.mapToRealUsers(jsonusers)),
      catchError(error => this.processHttpError(error)
    ));
  }

  getExtendedUsers() : Observable<User[]> {
    return this.http.get(this.serverUrl + "users/" + this.token).pipe(
      map(jsonusers => this.mapToRealUsers(jsonusers)),
      catchError(error => this.processHttpError(error)
    ));
  }

  getUser(id:number) : Observable<User> {
    return this.http.get<User>(this.serverUrl + "user/" +id+ "/"+ this.token).pipe(
      map(u => User.clone(u)),
      catchError(error => this.processHttpError(error)
    ));
  }

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(this.serverUrl + "users/" + this.token, user).pipe(
      map(u => User.clone(u)),
      catchError(error => this.processHttpError(error))
    )
  }

  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete(this.serverUrl + "user/" +userId + "/" + this.token).pipe(
      mapTo(true),
      catchError(error => this.processHttpError(error))
    )
  }

  getGroups() : Observable<Group[]> {
    return this.http.get<Group[]>(this.serverUrl + "groups").pipe(
      catchError(error => this.processHttpError(error)
    ));
  }

  private processHttpError(error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.snackbarService.errorMessage("Server je nedostupný");
        return;
      }
      if (error.status >= 400 && error.status < 500) {
//        const message = error.error.errorMessage ? error.error.errorMessage : JSON.parse(error.error).errorMessage;
//        const message = error.error.errorMessage ?? JSON.parse(error.error).errorMessage; // undefined, false, null
        const message = error.error.errorMessage || JSON.parse(error.error).errorMessage; // undefined, false, null, NaN, "", 0
        if (error.status === 401) {
          this.store.dispatch(new OldTokenLogout())
          this.snackbarService.errorMessage("Sedenie vypršalo");
          return EMPTY;
        }
        this.snackbarService.errorMessage(message);
        return EMPTY;
      }
      this.snackbarService.errorMessage("Chyba servera: " + error.message);
    } else {
      this.snackbarService.errorMessage("Chyba programátora: " + JSON.stringify(error));
    }
    return EMPTY;
  } 

  private mapToRealUsers(jsonusers: any): User[] {
    // let result:User[] = [];
    // for (let user of jsonusers) {
    //   result.push(User.clone(user));
    // }
    // return result;
    return jsonusers.map(elem => User.clone(elem));
  }

}
