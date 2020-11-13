import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/entities/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = [ new User('AnnaService', 'anna@anna.sk'),
            new User('JozefService', 'jozef@anna.sk'), 
            new User('MilanService', 'milan@gmail.com', 3)];
  private serverUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  getUsersLocalSynchronne() : User[] {
    return this.users;
  }

  getUsersLocalAsychynchonne() : Observable<User[]> {
    return of(this.users);
  }

  getUsers() : Observable<User[]> {
    return this.http.get(this.serverUrl + "users").pipe(
      map(jsonusers => this.mapToRealUsers(jsonusers))
    );
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
