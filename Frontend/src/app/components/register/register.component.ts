import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user'; 
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userService:UserService, private router:Router, private notifier:NotifierService, private http:HttpClient){
  }
  submitted=false;
  showSpinner=false;
  showMessage=false;
  Users:any=[];
  id:any='';
  now:Date=new Date();

  // custom validator to check passwords matching
  matching(controlName:string, checkControlName:string):ValidatorFn {
    return (controls: AbstractControl) =>{
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if(control==null)
      return null
      if(checkControl==null)
      return null
      if(control.value!== checkControl.value){
        checkControl.setErrors({ matching : true});
        return { matching : true};
      }
      else{
        return null;
      }
    }
  }

  //Custom validator to check correct DOB
  // checkAge(dob:string):ValidatorFn{
  //   return (controls: AbstractControl)=>{
  //   const control = controls.get(dob);
  //   if(control==null){
  //   return null
  //   }
  //   const readDob = new Date(control.value);
  //   const tob = (new Date(control.value)).getTime();
  //   const currTime = (new Date()).getTime();
  //   const diff = (currTime - tob) / 31536000000;
  //   if((currTime - tob) / 31536000000 < 3 || (currTime - tob) / 31536000000 > 130 ){
  //     control.setErrors({age : true});
  //     this.notifier.showNotification("Incorrect date of birth! Age should be between 3 and 130 years!","OK","error",'bottom')
  //     return { age: true};
  //   }
  //     else{
  //     return null;
  //   }
  // }
  // }

  registrationForm=new FormGroup({
    firstName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    lastName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    password: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm)]),
    passwordConf: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm)]),
    email: new FormControl('',[Validators.required,Validators.email])
    // birthDate: new FormControl(new Date("2003,11,07"),[Validators.required]),
    // username: new FormControl('',[Validators.required,Validators.pattern(/^[A-Za-z](\w){5,}$/)])
  },{
    validators:[this.matching("password","passwordConf")]
  })

  // get birthDate(){
  //   return this.registrationForm.get("birthDate");
  // }

  get firstName(){
    return this.registrationForm.get("firstName");
  }

  get lastName(){
    return this.registrationForm.get("lastName");
  }

  get password(){
    return this.registrationForm.get("password");
  }

  get passwordConf(){
    return this.registrationForm.get("passwordConf");
  }

  get email(){
    return this.registrationForm.get("email");
  }

  // get username(){
  //   return this.registrationForm.get("username");
  // }

  OnSubmit(){
    this.submitted=false;
    if(this.registrationForm.invalid){
    return;
    }
  }

  register(){
    this.showSpinner=true;
    this.submitted=true;
    if(this.registrationForm.invalid){
      return;
    }
    let email=(this.registrationForm.value['email'])!;
    let password=(this.registrationForm.value['password'])!;
    let firstname=(this.registrationForm.value['firstName'])!;
    let lastname=(this.registrationForm.value['lastName'])!;
    let req ={email:email, firstname:firstname, lastname:lastname, password:password}
    this.userService.createUser(req);
    this.showSpinner=false;
    // this.http.post<any>("http://192.168.3.84:3000/api/user", req).pipe(catchError(handleError())).subscribe((result)=>{
    //   if (result.status == "Success!"){
    //     this.showSpinner=false;
    //     this.notifier.showNotification("User created!","Ok","success","top");
    //     return;
    //   }
    // })

    // function handleError(error: HttpErrorResponse) {
    //   if (error.status === 0) {
    //     // A client-side or network error occurred. Handle it accordingly.
    //     console.error('An error occurred:', error.error);
    //   } else {
    //     // The backend returned an unsuccessful response code.
    //     // The response body may contain clues as to what went wrong.
    //     console.error(
    //       `Backend returned code ${error.status}, body was: `, error.error);
    //   }
    //   // Return an observable with a user-facing error message.
    //   return throwError(() => new Error('Something bad happened; please try again later.'));
    // }
    // let birthDate=(this.registrationForm.value['birthDate'].getTime());
    // let username=this.registrationForm.value['username'];
    
    // check if the emeil entered is already used by another user
    // let existEmailUser = this.Users.find((x: { email: string; })=>{
    //   return x.email === email;
    // });

    // if(existEmailUser){
    //   this.showSpinner=false;
    //   this.notifier.showNotification("Email already used!","OK","error", "bottom");
    //   return;
    // }

   

    // let user:User={firstname, lastname, password, email};

    
  
    // this.authService.SignUp(email,password).subscribe((data)=>{
    //   this.showSpinner=false;
    //   this.notifier.showNotification("User successfully registered!","OK","success","top");
    // });
  }

  
}
