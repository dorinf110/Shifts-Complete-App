import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(private userService:UserService, private router:Router, private notifier:NotifierService){}
  submitted=false;
  showSpinner=false;
  Users:any=[];
  id:any='';

  loginForm= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm)]),
    })

  OnSubmit(){
    this.submitted=false;
    if(this.loginForm.invalid){
    return;
    }
  }  

  get email(){
    return this.loginForm.get("email");
  }

  get password(){
    return this.loginForm.get("password");
  }

  login(){
    this.showSpinner=true;
    this.submitted=true;

    if(this.loginForm.invalid){
      return;
    }
    let email=this.loginForm.value['email']!;
    let password=this.loginForm.value['password']!;
    this.userService.loginUser(email, password);
    // this.authService.SignIn(email,password).subscribe((data)=>{
      this.showSpinner=false;
    //   data.then(data=>{
    //     this.notifier.showNotification("You are logged in!", "OK", "success",'bottom');
    //     this.router.navigate['\home'];
    //   }).catch(()=>{
    //     this.notifier.showNotification("Email or password incorrect!", "OK", "error",'top');
    //     this.loginForm.reset();
        return;
    //   })} 
    // );
    
  }

  ngOnInit(): void {}

}
