import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DataService } from '../data.service';
import {Router} from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginAsAdmin: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  emailMatcher = new MyErrorStateMatcher();

  usernameFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  usernameMatcher = new MyErrorStateMatcher();

  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordMatcher = new MyErrorStateMatcher();

  constructor(
    private dataservice: DataService,
    private route:Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.loginAsAdmin) {
      this.dataservice.loginAsAdmin({ 
        username: this.usernameFormControl.value,
        password: this.passwordFormControl.value
      }).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('isAdmin', res.isAdmin);
          localStorage.setItem('username', res.user.username);
          localStorage.removeItem('id');
          localStorage.removeItem('email');
          this.route.navigate(['/home']);
        },(err) => {
          this.errorMsg = err.error.message;
          this.isError = true;
          console.log(err);
        }
      );
    }else {
      this.dataservice.loginAsUser({ 
        email: this.emailFormControl.value,
        password: this.passwordFormControl.value
      }).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('isAdmin', res.isAdmin);
          localStorage.setItem('id', res.user._id);
          localStorage.setItem('email', res.user.email);
          localStorage.setItem('username', res.user.username);
          this.route.navigate(['/home']);
          console.log(res);
        },(err) => {
          this.errorMsg = err.error.message;
          this.isError = true;
          console.log(err);
        }
      );
    }
  }
}
