import { Injectable } from '@angular/core';
import {Meteor} from "meteor/meteor";
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { of, EMPTY }  from 'rxjs';
import { mergeMap, take }         from 'rxjs/operators';

@Injectable()
export class AuthService implements Resolve<any>{

  private user: any;
  users_sub_obs: any;
  users_sub: any;
  constructor() {
    console.log("Constructed")
   }
//   setUser(user) { this.user = user; }
  getUserDetails(){ 
      return Observable.create(observer => { MeteorObservable.subscribe('uid_sub', Meteor.userId()).subscribe(() => {
            this.users_sub_obs = Meteor.users.find({}).fetch();
            console.log(this.users_sub_obs)
            
            return this.users_sub_obs[0];
        })
        });
 }

 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    console.log("Resolve Called")
    let id = route.paramMap.get('id');
    // return this.auth.getUserDetails();
    return this.getUserDetails().pipe(      
      mergeMap(user => {
        let roles = route.data["roles"] as Array<string>;
          console.log(user)
          let d = of(user);
          console.log(d)

          return d;
        
        
      })
    );
  }
  
}
