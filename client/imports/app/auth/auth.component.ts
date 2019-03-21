import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import jQuery from 'jquery';
// import Meteor from 'meteor/meteor';
import { Router } from '@angular/router'

@Component({
  selector: 'auth',
  templateUrl: 'auth.html',
  styleUrls: ['auth.scss']
})
export class AuthComponent implements AfterViewInit, OnInit {  
    usn: string;
    pwd: string;
    data: any;
    
    constructor(private router:Router,private _ngZone: NgZone){
        
    }
    login(){
      if(this.usn.length > 0 && this.pwd.length>0){
        let self = this;
        let user = Meteor.user();
        //   this.data = Meteor.call('userLogin', {username: this.usn, password: this.pwd});
        this.data = Meteor.loginWithPassword(this.usn, this.pwd, function(err){
            if(err){
                return false;
            }
            else{      
              if(user.username=='admin') 
                // this.ngZone.run(() => this.router.navigate(['dashboard'])).then();
                self._ngZone.run(() => {
                  self.router.navigate(['dashboard']);
                })
              else if(user.profile.type=='eventhead'){

                // this.ngZone.run(() => this.router.navigate(['manage/event'])).then();
                self._ngZone.run(() => {
                  self.router.navigate(['manage/event'])
                });
              }else if(user.profile.type=='reception'){
                self._ngZone.run(() => {
                  self.router.navigate(['teams'])
                });
              }

                // self.router.navigate(['manage/event']);
            }
        })
      }
  }

  ngOnInit(){
    if(Meteor.userId()){

      Tracker.autorun(() => {
        let user = Meteor.user();
        console.log("Run")
        if(user)
          if(user.username=='admin')
            this._ngZone.run(() => {
              this.router.navigate(['dashboard']);
            });
          else
            this._ngZone.run(() => {
              this.router.navigate(['manage/event']);
            });
      }); 
    }
  }

  ngAfterViewInit(){
      
  }
}
