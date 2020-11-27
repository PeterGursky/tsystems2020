import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { SnackbarService } from 'src/services/snackbar.service';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hidePassword = true;
  passwordMessage = "";

  registerForm = new FormGroup({
    name: new FormControl('', 
                          [Validators.required, Validators.minLength(4)],
                          this.serverConfictValidator('name')),
    email: new FormControl('', 
                           [Validators.required, Validators.email, 
                                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")],
                          this.serverConfictValidator('email')),
    password: new FormControl('', this.passwordValidator()),
    password2: new FormControl('')
  }, this.passwordsMatchValidator);

  constructor(private usersService: UsersService, 
              private snackBarService: SnackbarService,
              private router: Router) { }

  ngOnInit(): void {
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const test= zxcvbn(control.value);
      this.passwordMessage = "Sila hesla:" + test.score + "/4 - musí byť aspoň 3 " + 
                      test.feedback.warning + " prelomiteľné za " + 
                      test.crack_times_display.offline_slow_hashing_1e4_per_second;
      return test.score < 3 ? {weakPassword: this.passwordMessage} : null;
    };
  }

  passwordsMatchValidator(control: FormGroup): ValidationErrors {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      password2.setErrors({ differentPasswords: 'Passwords do not match' });
      return { differentPasswords: 'Passwords do not match' };
    }
  }

  serverConfictValidator(fieldName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const username = fieldName === 'name' ? control.value : "";
      const email = fieldName === 'email' ? this.email.value : "";
      const user = new User(username, email);
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

  get name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get password2(): FormControl {
    return this.registerForm.get('password2') as FormControl;
  }

  submitForm() {
    const user = new User(this.name.value, this.email.value, undefined, undefined, this.password.value);
    this.usersService.register(user).subscribe(newuser => {
      this.snackBarService.successMessage("Registrácia používateľa " + this.name.value + " bola úspešná");
      this.router.navigateByUrl("/login");
    });
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
