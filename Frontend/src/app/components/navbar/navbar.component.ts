import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit{
  constructor(private router:Router, private notifier:NotifierService, 
     private userServ:UserService){}
  
     foundUsr: User;
     isAdmin:boolean=false;
  
  
  logout(){
    let item = localStorage.getItem("loginToken");
    if(item){
      localStorage.clear();
      this.notifier.showNotification("You are logged out!", "OK", "warning",'bottom');
      this.router.navigate(['register']);
    }
   }
   
  async ngOnInit(): Promise<void> {
    this.userServ.checkUserLogin();
    await this.userServ.getUser().pipe(catchError(this.userServ.handleError)).subscribe(user=>{
      if(user.data.permission=="admin"){
        this.isAdmin=true;
        this.userServ.isAdmin=true;
        // console.log("Userul este admin!");
      };
      
    });

    }
  }

