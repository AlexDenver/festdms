import { Injectable, OnInit, NgZone, Inject } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import {MongoObservable, MeteorObservable, zoneOperator, ObservableCursor} from 'meteor-rxjs';
import { Observable, Subscription  } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import {Roles} from "meteor/alanning:roles";
import { of, EMPTY }  from 'rxjs';
import { mergeMap, take }         from 'rxjs/operators';
import { AuthService } from './auth.service';


  @Injectable({
    providedIn: 'root'
  })
  export class RoleGuard implements OnInit{
    user;
    constructor(private router:Router, private route: ActivatedRoute,private auth: AuthService){}
    // ngOnInit(){
    //   this.route.data
    //   .subscribe((data: { user: any }) => {
    //     this.user = data.user;
    //   });
    // }

    // canDeactivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>{
    //     let roles = route.data["roles"] as Array<string>;
    //     // console.log(route.data);
    //     console.log(this.user)
    //     return Roles.userIsInRole(this.user, roles);
    // }

   

  }