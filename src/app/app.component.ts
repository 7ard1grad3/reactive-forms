
import { Observable } from 'rxjs/Rx';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Vasiok', 'Lolik'];
  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl('test', [Validators.required, this.forbiddenNamesValidator.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenAsync),
      }),
        'gender': new FormControl('male'),
        'hobbies': new FormArray([])
    });
    this.signupForm.valueChanges.subscribe(
      (value) => {
        console.log(value); // On value change in form
      }
    );
    this.signupForm.statusChanges.subscribe(
      (status) => {
        console.log(status); // May have few statuses (Invalid | Pending | Valid)
      }
    );
    /* Add values to formGroup */
    this.signupForm.setValue({
      'userData': {
        'username': 'vasiok',
        'email': 'test@test.com'
      },
      'gender': 'female',
      'hobbies': []
    });
    this.signupForm.patchValue({
      'userData': {
        'username': 'Lolik',
      }
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }
  forbiddenNamesValidator(contrtol: FormControl): {[s: string]: boolean} {
    // That what function should return {nameIsForbidden:true}
    if (this.forbiddenUsernames.indexOf(contrtol.value) !== -1) {
      return {'nameIsForbidden': true};
    }else {
      return null; // In case of successfull validation, must be returned null only
    }
  }

  forbiddenAsync(contrtol: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(
        () => {
          if (contrtol.value === 'test@test.com') {
            resolve({'emailIsForbidden': true});
          }else {
             resolve(null);
          }
        }
        , 1500
      );
    });
    return promise;
  }
}
