import { Component, Input, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-edit-child',
  templateUrl: './user-edit-child.component.html',
  styleUrls: ['./user-edit-child.component.css']
})
export class UserEditChildComponent implements OnInit {

  @Input() user: User;

  userEditForm = new FormGroup({
    name: new FormControl('', 
                          [Validators.required, Validators.minLength(4)],
                          this.serverConfictValidator('name')),
    email: new FormControl('', 
                           [Validators.required, Validators.email, 
                                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")],
                          this.serverConfictValidator('email')),
    password: new FormControl(''),
    active: new FormControl(true),
  });
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  get name(): FormControl {
    return this.userEditForm.get('name') as FormControl;
  }
  get email(): FormControl {
    return this.userEditForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.userEditForm.get('password') as FormControl;
  }
  get active(): FormControl {
    return this.userEditForm.get('active') as FormControl;
  }
  serverConfictValidator(fieldName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const username = fieldName === 'name' ? control.value : "";
      const email = fieldName === 'email' ? this.email.value : "";
      const user = new User(username, email, this.user.id);
      return this.usersService.userConflicts(user).pipe(
        map( conflictsArray => {
          if (conflictsArray.includes(fieldName)) {
            return { conflictField: "táto hodnota už na serveri je"};
          } 
          return null;
        })
      );
    }
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
      if (value.email || value.pattern) {
        return "Zlý formát e-mailu";
      }
      return JSON.stringify(value);
    }
  }
}
