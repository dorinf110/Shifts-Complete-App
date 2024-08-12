import { Component, OnInit } from '@angular/core';
import { Router } from 'express';
import { catchError } from 'rxjs';
import { DispAllShifts } from 'src/app/interfaces/disp-all-shifts';
import { DispUser } from 'src/app/interfaces/disp-user';
import { NotifierService } from 'src/app/services/notifier.service';
import { ShiftService } from 'src/app/services/shift.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-allshifts',
  templateUrl: './allshifts.component.html',
  styleUrls: ['./allshifts.component.css']
})
export class AllshiftsComponent implements OnInit{
  constructor ( private notifier:NotifierService, private userServ:UserService, private shiftServ:ShiftService,
    private router:Router){}


hasShifts:boolean=false;//variable to check if there are  registered workers

Users: any[];
Shifts:any[];
displayedColumns:string[]=['name','date','start', 'end','perHour','place','id','Action'];
dataSource: any;
initialDataSource: any;
dispShifts:DispAllShifts[];
showSpinner:boolean=false;
submitted:boolean=true;
mostProfMonth:string;
worker:string; 
monthShifts:any[];
isAdmin:boolean=false;

    
// 

async ngOnInit(): Promise<void> {
  this.userServ.checkUserLogin();
  this.userServ.setAuth();
    await this.userServ.getUser().pipe(catchError(this.userServ.handleError)).subscribe(user=>{
      if(user.data.permission=="admin"){
        // this.isAdmin=true;
        // console.log("Userul este admin!");
        this.userServ.getAllUsers().pipe(catchError(this.userServ.handleError)).subscribe(user=>{
          this.Users=user.data;
          if (this.Users.length == 0){
            this.notifier.showNotification("There are no users.","Ok","warning","bottom");
            return;
         }
         this.shiftServ.getAllShifts().pipe(catchError(this.userServ.handleError)).subscribe((shift)=>{
            this.Shifts=shift.data;
            if (this.Shifts.length > 0 ){
              this.hasShifts=true;
              this.dispShifts=[];
          // prepare the array of shifts to display
             for (let shift of this.Shifts){
              let user = this.Users.find((x)=>{return x.id==shift.userId});
              if(!user){
                // this.notifier.showNotification("There are no users.","Ok","warning","bottom");
                return;
              }
              let firstName:string = user.firstname;
              let lastName:string = user.lastname;
              let name:string = `${firstName} ${lastName}`;
              let id: string = shift.id;
              let place: string = shift.place;
              let perHour:number = shift.perHour;
              let date1 = new Date(shift.start);
              let date =date1.toString();
              let startDate = new Date(shift.start);
                  // console.log(start);
                  let start = `${startDate.getHours()}:${startDate.getMinutes()}`;
                  // console.log(start);
                  let endDate= new Date(shift.end);
                  let end = `${endDate.getHours()}:${endDate.getMinutes()}`;
               
          // create a new object of type DisplayShift (data to be shown in the shifts table) 
              let newDispShift: DispAllShifts = { name, date, start, end,  perHour, place,id};
              // console.log(newDispUser);
          // push the object in an array 
              this.dispShifts.push(newDispShift);
              this.dataSource=this.dispShifts;
              // console.log(this.dataSource);
              this.initialDataSource=this.dispShifts;
            }}
          });
        })
    
      }
     });
    }
    
    delete(item){
      if(confirm("Are you sure? The shift will be deleted!")){
        // find shift by id
      let shift = this.Shifts.find((x)=> {return x.id === item.id});
      if(shift){
        // check if trying to delete current admin user
        // if (user._id == this.userServ.userId){
        //   this.notifier.showNotification("Cannot delete your own admin user!","Ok","warning","bottom");
        //   return;
        // }
        this.shiftServ.deleteShift(shift.id).subscribe(res=>{
          if (res.status == "Success!"){
            this.notifier.showNotification("Shift deleted!","Ok","success","bottom");
          }else{
            this.notifier.showNotification("Eroare!","Ok","error","bottom");
            return;
          }
        })
      }else
      {
        this.notifier.showNotification("Shift not found!","Ok","warning","bottom");
      } 
      this.ngOnInit();
      }}
 }
