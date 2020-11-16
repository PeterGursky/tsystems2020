import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subscriber, throwError } from 'rxjs';
import { User } from 'src/entities/user';
import { catchError, map } from 'rxjs/operators';
import { Auth } from 'src/entities/auth';
import { SnackbarService } from './snackbar.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = [ new User('AnnaService', 'anna@anna.sk'),
            new User('JozefService', 'jozef@anna.sk'), 
            new User('MilanService', 'milan@gmail.com', 3)];
  private serverUrl = "http://localhost:8080/";
//  private token:string;
  private loggedUserSubscriber: Subscriber<string>;
  private get token(): string {
    return localStorage.getItem('token');
  }

  private set token(t: string) {
    if (t)
      localStorage.setItem('token', t);
    else
      localStorage.removeItem('token');  
  }

  private get user(): string {
    return localStorage.getItem('user');
  }

  private set user(u: string) {
    this.loggedUserSubscriber.next(u);
    if (u)
      localStorage.setItem('user', u);
    else
      localStorage.removeItem('user');  
  }

  constructor(private http: HttpClient, private snackbarService: SnackbarService) { }

  login(auth:Auth):Observable<boolean> {
    return this.http.post(this.serverUrl + 'login', auth, {responseType:"text"})
    .pipe(
      map(token => {
        this.token = token;
        this.user = auth.name;
        this.snackbarService.successMessage("úspešné prihlásenie používateľa " + auth.name);
        return true;
      }),
      catchError(error => this.processHttpError(error))
    );
  }
  
  logout() {
    if (this.token) {
      this.http.get(this.serverUrl + 'logout/' + this.token).pipe(
        catchError(error => this.processHttpError(error))
      ).subscribe();
      this.token = null;
      this.user = null;
    }
  }

  loggedUser(): Observable<string> {
    return new Observable(subscriber => {
      this.loggedUserSubscriber = subscriber;
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
