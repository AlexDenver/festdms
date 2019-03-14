import { Injectable, OnInit, NgZone, Inject } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import {MongoObservable, MeteorObservable, zoneOperator, ObservableCursor} from 'meteor-rxjs';
import { Observable, Subscription  } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import {Roles} from "meteor/alanning:roles";



  @Injectable({
    providedIn: 'root'
  })
  export class RoleGuard implements OnInit{


    ngOnInit(){
        
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot){
        let roles = route.data["roles"] as Array<string>;
        // console.log(route.data);

        return Roles.userIsInRole(Meteor.userId(), roles);
    }
  }