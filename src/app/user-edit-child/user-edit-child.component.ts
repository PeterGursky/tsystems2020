import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-edit-child',
  templateUrl: './user-edit-child.component.html',
  styleUrls: ['./user-edit-child.component.css']
})
export class UserEditChildComponent implements OnInit, OnChanges {

  @Input() user: User;
  allGroups: Group[];

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
    groups: new FormArray([])
  });
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.user) {
      this.name.setValue(this.user.name);
      this.email.setValue(this.user.email);
      this.active.setValue(this.user.active);
      this.usersService.getGroups().subscribe( allGroups => {
        this.allGroups = allGroups;
        for(let group of allGroups) {
          if (this.user.groups.some(usergroup => usergroup.id === group.id)) {
            this.groups.push(new FormControl(true));
          } else {
            this.groups.push(new FormControl(false));
          }
        }
      });
    }
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
  get groups(): FormArray {
    return this.userEditForm.get('groups') as FormArray;
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
