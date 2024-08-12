import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/interfaces/shift';
import { User } from 'src/app/interfaces/user';
import { DispShift } from 'src/app/interfaces/disp-shift';
import { FormGroup, FormControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';
import { ShiftService } from 'src/app/services/shift.service';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-myshifts',
  templateUrl: './myshifts.component.html',
  styleUrls: ['./myshifts.component.css']
})
export class MyshiftsComponent implements OnInit{
  constructor ( private notifier:NotifierService, private router:Router, private shiftServ:ShiftService, private userServ:UserService){}

  haveShifts:boolean=false;
  userShifts:any[];

  Shifts:any[];
  users:any[];
  logUser:User;
  displayedColumns:string[]=['date', 'startTime', 'endTime', 'wage','place','id'];
  dataSource;
  initialDataSource;
  dispShifts:DispShift[];
  showSpinner:boolean=false;
  submitted:boolean=true;  

  // lgUsrId(event){
  //   this.logUsrId = event;
  // }

  searchForm=new FormGroup({
    sDate:new FormControl(''),
    eDate:new FormControl(''),
    place: new FormControl('')
  })

  addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  OnSubmit(){
    // this.submitted=false;
    if(this.searchForm.invalid){
    return;
    }
  }

  // filterByDate(startDate:string, endDate:string,){
  //   let sDateUT = (new Date(startDate)).getTime();
  //     let eDateUT = (new Date(endDate)).getTime();
  //     if(eDateUT < sDateUT){
  //       this.notifier.showNotification("The start date cannot be after the end date","OK","warning","top");
  //       this.searchForm.reset();
  //       return;
  //     }
  //     this.dispShifts=this.dispShifts.filter(shift=>{
  //       if((new Date(shift.date)).getTime() >= sDateUT && (new Date(shift.date)).getTime() <= eDateUT) {
  //       return shift;
  //     }
  //       else return null;  
  //     });
  //     this.dataSource=this.dispShifts;
  // }

  // filterByPlace(place:string){
  //   this.dispShifts = this.dispShifts.filter((shift)=>shift.place === place);
  //   this.dataSource=this.dispShifts;
  // }

  // search(){
  //   // get values from the inputs
  //   let sDate = this.searchForm.value['sDate'];
  //   let eDate = this.searchForm.value['eDate'];
  //   let place = this.searchForm.value['place'];

  //   if (sDate != '' && sDate != null){
  //     if (eDate != '' && eDate != null ){
  //       this.filterByDate(sDate,eDate);
  //       if (place !='' && place != null){
  //         this.filterByPlace(place);
  //         return;
  //       } 
  //     }
  //     else if(place == '' || place == null){
  //       this.notifier.showNotification("Please enter the correct end date!", "OK", "error", "top");
  //       return;
  //     }
  //   }
  //   else{
  //     if (place !='' && place != null){
  //       this.filterByPlace(place);
  //       return;
  //     }
  //     else {
  //       this.notifier.showNotification("Please enter search criteria, dates or place!", "OK", "warning", "bottom");
  //       return;
  //     }
  //   }}
    
  Cancel(){
    this.searchForm.reset();
    // this.dataSource=this.initialDataSource;
    this.dispShifts=this.initialDataSource;
    this.dataSource = this.dispShifts;
  }

  clickedRow(row){
    this.shiftServ.setClickedRow(row);
    this.router.navigate(['/edit-shift']);
  } 
  
  ngOnInit(): void {
    this.shiftServ.getShiftsByUserId().pipe(catchError(this.userServ.handleError)).subscribe(shifts=>{
      if(shifts.data.length>0){
        this.haveShifts=true;
        this.userShifts=shifts.data;
        this.dispShifts=[];
        // this.userShifts=this.userShifts.map((shift)=>{
        //   shift.date = new Date(shift.date);
        //   return shift;
        // })
        // console.log(JSON.stringify(this.userShifts));
        for (let shift of this.userShifts){
                  // let date:string = shift.date;
                  // let date = new Date(shift.startTime);
                  // let date= "1707059941656";
                  let date1 = new Date(shift.start);
                  let date =date1.toString();
                  // console.log(date1);
                  // let date= date1.getDate.toString();
                  let startDate = new Date(shift.start);
                  // console.log(start);
                  let start = `${startDate.getHours()}:${startDate.getMinutes()}`;
                  // console.log(start);
                  let endDate= new Date(shift.end);
                  let end = `${endDate.getHours()}:${endDate.getMinutes()}`;
                  // let end:string = shift.end;
                  let perHour:number = shift.perHour;
                  let place: string = shift.place;
                  let id: string = shift._id; 
                  // console.log(id);
                  // let userId= this.userServ.userId;
                  // let shiftId = shift.shiftId;
                  // let profit = shift.shift.profit;
                  // create a new object of type DisplayShift (data to be shown in the shifts table) 
                  let newDispShift: DispShift = {date, start, end, perHour, place, id};
                  // console.log("Dispshift is: " + JSON.stringify(newDispShift));
                  // push the object in an array 
                  this.dispShifts.push(newDispShift);
                }
        this.dataSource=this.dispShifts;
        this.initialDataSource=this.dispShifts;
      }
      else{
        this.notifier.showNotification("You have no shifts recorded.","Ok","warning","bottom");
        return;
      }
    })
    
    //     // if shifts have been found, change the date format from Unix time to date format
    //     if (this.Shifts.length > 0 ){
    //       this.haveShifts=true;
    //       this.dispShifts=[];
    //       this.Shifts=this.Shifts.map((shift)=>{shift.shift['date'] = new Date(shift.shift['date']);
    //       return shift;
    //       })
    //       // prepare the array of shifts to display 
    //       for (let shift of this.Shifts){
    //         let date:string = shift.shift.date;
    //         let startTime:string = shift.shift.startTime;
    //         let endTime:string = shift.shift.endTime;
    //         let wage:number = shift.shift.wage;
    //         let place: string = shift.shift.place;
    //         let shiftId = shift.shiftId;
    //         let profit = shift.shift.profit;
    //         // create a new object of type DisplayShift (data to be shown in the shifts table) 
    //         let newDispShift: DispShift = {shiftId, date, startTime, endTime, wage, place, profit};
    //         // push the object in an array 
    //         this.dispShifts.push(newDispShift);
    //       }
    //    }
    //   //  setting the dataSource=(array of DisplayShifts) for the table to be shown 
    //    this.dataSource=this.dispShifts;
    //    this.initialDataSource=this.dispShifts;
    //   })
    //  }  
    //  }
    // }
   };
  }


