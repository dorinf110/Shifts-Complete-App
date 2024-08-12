import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotifierService } from './notifier.service';
import { catchError} from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  clickedRow:{shiftId:string,date:string, startTime:string, endTime:string, wage:number, place:string};
  constructor(private router:Router, private http:HttpClient, private notifier:NotifierService, private userServ:UserService) { }

  public createShift(req:{}){
    this.http.post<any>("http://localhost:3000/api/shifts", req, this.userServ.httpOptions).pipe(catchError(this.userServ.handleError)).subscribe((result:any)=>{
      if (result.status == "Success!"){
        // this.showSpinner=false;
        this.notifier.showNotification("Shift created!","Ok","success","top");
        return;
      }},err=>{
      this.notifier.showNotification(err,"Ok","error","top");
      console.log(err);
    })
   }

   public getShiftsByUserId(){
    this.userServ.checkUserLogin();
    this.userServ.setAuth();
       
    return this.http.get<any>(`http://localhost:3000/api/shifts/user/${this.userServ.userId}`, this.userServ.httpOptions);
    // this.getUser().subscribe((user)=>{
    //   if(user.data.permission=="admin"){
    //     this.isAdmin=true;
    //     }
    // return  this.http.get<any>(`http://localhost:3000/api/user`, this.httpOptions);
    //  })
    // }    return null;
  }    

  public updateShift(req:{},id:string){
    this.userServ.checkUserLogin();
    this.userServ.setAuth();

    this.http.patch<any>(`http://localhost:3000/api/shifts/${id}`,req, this.userServ.httpOptions).pipe(catchError(this.userServ.handleError)).subscribe((result:any)=>{
      if (result.status == "Success!"){
        // this.showSpinner=false;
        this.notifier.showNotification("Shift updated!","Ok","success","top");
        return;
      }},err=>{
      this.notifier.showNotification(err,"Ok","error","top");
      console.log(err);
    });
  }

  public getAllShifts(){
    this.userServ.setAuth();
    this.userServ.getUser().subscribe(user=>{
      if(user.permission!="admin"){
        this.notifier.showNotification("Permission denied.","Ok","warning","bottom");
        return;
      }
    })
    return  this.http.get<any>(`http://localhost:3000/api/user`, this.userServ.httpOptions);
  }

  public deleteShift(id:string){
    this.userServ.setAuth();
    this.userServ.getUser().subscribe(user=>{
      if(user.permission!="admin"){
        this.notifier.showNotification("Permission denied.","Ok","warning","bottom");
        return;
      }
    })
    return this.http.delete<any>(`http://localhost:3000/api/shifts/${id}`, this.userServ.httpOptions);  
  }


  public setClickedRow(value:{shiftId:string,date:string, startTime:string, endTime:string, wage:number, place:string, profit:number}){
    this.clickedRow=value;
  }

  public getClickedRow(){
    return this.clickedRow;
  }
}
