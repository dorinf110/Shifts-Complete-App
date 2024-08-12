import { Component, OnInit } from '@angular/core';
import { DispUser } from 'src/app/interfaces/disp-user';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit{
  constructor ( private notifier:NotifierService, private userServ:UserService,
    private router:Router){}


hasUsers:boolean=false;//variable to check if there are  registered workers

Users: any[];
displayedColumns:string[]=['email','firstName', 'lastName','Action'];
dataSource: any;
initialDataSource: any;
dispUsers:DispUser[];
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
        this.userServ.getAllUsers().pipe(catchError(this.userServ.handleError)).subscribe((user)=>{
          this.Users=user.data;
          if (this.Users.length > 0 ){
            this.hasUsers=true;
            this.dispUsers=[];
        // prepare the array of users to display
           for (let user of this.Users){
            let firstName:string = user.firstname;
            let lastName:string = user.lastname;
            let email: string = user.email;
             
        // create a new object of type DisplayShift (data to be shown in the shifts table) 
            let newDispUser: DispUser = { email, firstName, lastName};
            // console.log(newDispUser);
        // push the object in an array 
            this.dispUsers.push(newDispUser);
            this.dataSource=this.dispUsers;
            // console.log(this.dataSource);
            this.initialDataSource=this.dispUsers;
          }}
        });
      }
     });
    }
    
    delete(item){
      if(confirm("Are you sure? The user will be deleted!")){
        // find user by email
      let user = this.Users.find((x)=> {return x.email === item.email});
      if(user){
        // check if trying to delete current admin user
        if (user._id == this.userServ.userId){
          this.notifier.showNotification("Cannot delete your own admin user!","Ok","warning","bottom");
          return;
        }
        this.userServ.deleteUser(user._id).subscribe(res=>{
          if (res.status == "Success!"){
            this.notifier.showNotification("User deleted!","Ok","success","bottom");
          }else{
            this.notifier.showNotification("Eroare!","Ok","error","bottom");
            return;
          }
        })
      }else
      {
        this.notifier.showNotification("User not found!","Ok","warning","bottom");
      } 
      this.ngOnInit();
      }}
 }

