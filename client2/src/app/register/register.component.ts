import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private dataservice: DataService,
    private route:Router,
  ) { }

  ngOnInit(): void {
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  emailMatcher = new MyErrorStateMatcher();

  usernameFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  usernameMatcher = new MyErrorStateMatcher();

  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordMatcher = new MyErrorStateMatcher();

  onSubmit(): void {
    this.dataservice.register({
      username: this.usernameFormControl.value,
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value
    }).subscribe((res: any) => {
      console.log(res);
      this.route.navigate(['/login']);
    }, (err) => {
      console.log(err);
    });
  }

}
