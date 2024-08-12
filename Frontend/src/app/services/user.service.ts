import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotifierService } from './notifier.service';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router:Router, private http:HttpClient, public notifier:NotifierService) { }

  httpOptions={};
  userId:string='';
  token:string='';
  userFound!: User;
  isAdmin:boolean=false;
  userRow:{firstName:string, lastName:string, email:string};


  public checkUserLogin(){
    let item = localStorage.getItem("loginToken");
      if(item){
      item = JSON.parse(item);
    let loginAt =localStorage.getItem("lastLoginAt");
        // check if the user is logged in no more than an hour ago. Otherwise, logout user and navigate to login
    if(loginAt){
      let loginAtNr=+loginAt;    
    let curTime = (new Date()).getTime();
        if (curTime - loginAtNr > 3600000){
          this.notifier.showNotification("Login expired! Please, login again!","OK","warning","bottom");
          localStorage.clear();
          this.router.navigate(['login']);
          return false;
        } }
    }
    else{
    this.notifier.showNotification("You are not logged in! Please, login!","OK","warning","bottom");
     this.router.navigate(['login']);
     return false;
    }
    return true;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  public setAuth(){
      if(this.checkUserLogin()){
      this.token = localStorage.getItem("loginToken")!;
      this.token=JSON.parse(this.token);
      this.userId = this.getDecodedAccessToken(this.token).id;
    
      this.httpOptions={
        headers: new HttpHeaders({
          'Authorization':this.token!
        })
      };
    }
    else{
      this.notifier.showNotification("You are not logged in! Please, login!","OK","warning","bottom");
      this.router.navigate(['login']);
    }
  }

  public updateUser(req:{}){
    this.setAuth();
    this.getUser();
    this.http.patch<any>(`http://localhost:3000/api/user/${this.userId}`, req, this.httpOptions).pipe(catchError(this.handleError)).subscribe((result:any)=>{
      if (result.status == "Success!"){
        this.notifier.showNotification("User updated!","Ok","success","bottom");
        return;
      }
    },err=>{
      this.notifier.showNotification(err,"Ok","error","top");
      console.log(err);
    })
  }
  

  public getUser(){
    this.setAuth();
    // return  this.http.get<any>(`http://localhost:3000/api/user/${this.userId}`, this.httpOptions).toPromise()
    return this.http.get<any>(`http://localhost:3000/api/user/${this.userId}`, this.httpOptions);

    
    //  .pipe(catchError(this.handleError)).subscribe((result: any) => {
    //   // console.log("Result is: " + JSON.stringify(result));
    //   if (result.status === "Success!") {
    //     // this.notifier.showNotification("User found!","Ok","success","top");
    //     user = result.data;
    //     console.log("User found in serviciu este: " + JSON.stringify(user));
    //     return user;
    //     } else return { firstname: " ", lastname: " ", email: " ", password: " " };
    // }, err => {
    //   this.notifier.showNotification(err, "Ok", "error", "top");
    //   console.log(err);
    // })
    //  return {firstname:"Gogu",lastname:" ",email:" ", password:" "};
    // return {};
   }

  //  public getAllUsers():any{
  //       this.setAuth();
  //       this.getUser().pipe(catchError(this.handleError)).subscribe(user=>{
  //         if(user.data.permission=="admin"){
  //           this.isAdmin=true;
  //         }
  //         if (this.isAdmin){
  //          return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
  //         }
  //         return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
  //       }
    // return  this.http.get<any>(`http://localhost:3000/api/user/${this.userId}`, this.httpOptions).toPromise()
   
  public getAllUsers(){
    this.setAuth();
    this.getUser()
    
    return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
    // this.getUser().subscribe((user)=>{
    //   if(user.data.permission=="admin"){
    //     this.isAdmin=true;
    //     }
    // return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
    //  })
    // }    return null;
  } 

  public deleteUser(id){
    this.setAuth();
    return this.http.delete<any>(`http://localhost:3000/api/user/${id}`, this.httpOptions);
    // this.getUser().subscribe((user)=>{
    //   if(user.data.permission=="admin"){
    //     this.isAdmin=true;
    //     }
    // return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
    //  })
  } 


  public createUser(req:{}){
    this.http.post<any>("http://localhost:3000/api/user", req).pipe(catchError(this.handleError)).subscribe((result:any)=>{
      if (result.status == "Success!"){
        // this.showSpinner=false;
        this.notifier.showNotification("User created!","Ok","success","top");
        return;
      }
      },err=>{
      this.notifier.showNotification(err,"Ok","error","top");
      console.log(err);
    })
    
  }

  public loginUser(email:string, pass:string){
    let req ={email:email, password:pass};
    this.http.post<any>("http://localhost:3000/api/user/login", req).pipe(catchError(this.handleError)).subscribe((result:any)=>{
      if (result.status == "Success!"){
        this.notifier.showNotification("User logged in!","Ok","success","bottom");
        let token = result.token;
        localStorage.setItem('loginToken',JSON.stringify(token));
        localStorage.setItem('lastLoginAt',JSON.stringify(Date.now()));
        this.router.navigate(['\home']);
        return;
      }
      },err=>{
      this.notifier.showNotification(err,"Ok","error","top");
      console.log(err);
    })
  }

  public handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      this.notifier.showNotification("Network error","Ok","error","top");
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
        
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(`${JSON.stringify(error.error)}`));
  }
  public clickUserRow(value:{userId:string, firstName:string, lastName:string, birthDate:string, password:string, passwordConf:string, email:string}){
    this.userRow=value;
  }

  public getUserRow(){
    return this.userRow;
  }

}
