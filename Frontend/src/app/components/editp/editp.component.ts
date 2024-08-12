import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user'; 
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-editp',
  templateUrl: './editp.component.html',
  styleUrls: ['./editp.component.css']
})

export class EditpComponent implements OnInit{
  constructor(private router:Router, private userServ:UserService){
  }
  submitted=false;
  showSpinner=false;
  Users:any=[];
  id:any='';
  now:Date=new Date();
  usersUid:string[]=[];
  foundUsr!: User;
  foundUsrId:string="";
  myString:string="";

  editForm=new FormGroup({
    firstName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    lastName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    email: new FormControl('',[Validators.required,Validators.email])
  })

async ngOnInit():Promise<void> {
  this.userServ.setAuth();
  await this.userServ.getUser().pipe(catchError(this.userServ.handleError)).subscribe(user=>{
        // console.log("User in editp: " + JSON.stringify(user.data));
      this.foundUsr=user.data;
      this.editForm.controls['firstName'].setValue(this.foundUsr['firstname']);
      this.editForm.controls['lastName'].setValue(this.foundUsr['lastname']);
      this.editForm.controls['email'].setValue(this.foundUsr['email']);
    });
  };
   


  get firstName(){
    return this.editForm.get("firstName");
  }

  get lastName(){
    return this.editForm.get("lastName");
  }

  get email(){
    return this.editForm.get("email");
  }
  // get username(){
  //   return this.editForm.get("username");
  // }

  OnSubmit(){
    this.submitted=false;
    if(this.editForm.invalid){
    return;
    }
  }

 update(){
    this.showSpinner=true;
    this.submitted=true;
    // this.userServ.getUser();
    // console.log(JSON.stringify(this.foundUsr));
    if(this.editForm.invalid){
      return;
    }
    if (this.foundUsr){
      let email = this.editForm.value['email'];
      let firstname=this.editForm.value['firstName'];
      let lastname=this.editForm.value['lastName'];
    // // let birthDate=(this.editForm.value['birthDate'].getTime());
    // // let username=this.editForm.value['username'];
      let req = {firstname, lastname, email};
      this.userServ.updateUser(req);
      this.showSpinner=false;
      // this.notifier.showNotification("User updated!","OK","success","bottom");
      this.router.navigate(['/home']);
    }
  }
  

}
