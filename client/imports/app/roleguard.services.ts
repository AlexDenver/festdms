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

    constructor(private router: Router,private route: ActivatedRouteSnapshot){

    }
    ngOnInit(){
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
        let roles = route.data["roles"] as Array<string>;
        return   Roles.userIsInRole(Meteor.userId(), roles);
    }
  }