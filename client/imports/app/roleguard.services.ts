import { Injectable, OnInit, NgZone, Inject } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import {MongoObservable, MeteorObservable, zoneOperator, ObservableCursor} from 'meteor-rxjs';
import { Observable, Subscription  } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import {Roles} from "meteor/alanning:roles";



  @Injectable({
    providedIn: 'root'
  })
  export class RoleGuard implements OnInit{

    constructor(private router: Router){

    }
    ngOnInit(){
        
    }
    resolve(state: RouterStateSnapshot): Observable {
      let d = Meteor.user();
      if(d){
        return d;
      }else{
        this.router.navigate(['auth']);
      }

    }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot){
        let roles = route.data["roles"] as Array<string>;
        // console.log(route.data);   
        let us = Meteor.userId();     
          console.log(us)
        return Roles.userIsInRole(us, roles)  ;
    }
  }