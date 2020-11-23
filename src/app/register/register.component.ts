import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hidePassword = true;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email, 
                                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
    password: new FormControl('', this.passwordValidator()),
    password2: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const test= zxcvbn(control.value);
      const message = "Sila hesla:" + test.score + "/4 - musí byť aspoň 3";
      return test.score < 3 ? {weakPassword: message} : null;
    };
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
