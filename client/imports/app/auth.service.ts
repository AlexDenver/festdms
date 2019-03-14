import { Injectable } from '@angular/core';
import {Meteor} from "meteor/meteor";
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';

@Injectable()
export class AuthService {

  private user: any;

  constructor() { }
  setUser(user) { this.user = user; }
  getAuthenticated(){ 
    //   let d:MeteorObservable = ;;
    console.log("We Are Here.")



    }
}
