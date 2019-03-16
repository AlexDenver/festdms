import { Injectable, OnInit, NgZone, Inject } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import {MongoObservable, MeteorObservable, zoneOperator, ObservableCursor} from 'meteor-rxjs';
import { Observable, Subscription  } from 'rxjs';



import { EventsCollection, MyFestVars } from 'imports/collections/all';
import { MyFestEvent } from 'imports/models/events';

  @Injectable({
    providedIn: 'root'
  })
  export class MyFestService implements OnInit{
    
    events: any;
    private zone: NgZone;

    co = 0;
    events_sub: Observable<MyFestEvent[]>;
    EventsListSubscription: Subscription;
    fest_sub_obs: Observable<any> = false;

    festvars: Observable<MyFestEvent[]>;
    FestVarsSubscription: Subscription;


    constructor() {  
          
      this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(() => {        
        this.setEvents(EventsCollection.find({}));        
      });
      
      
      MeteorObservable.subscribe('fest_vars').subscribe(() => {        
        this.fest_sub_obs = MyFestVars.find({})
        this.fest_sub_obs.subscribe(c => {
            this.festvars = c[0];                
        })
      });


      // this.FestVarsSubscription = MeteorObservable.subscribe('fest_vars').subscribe(() => {        
      //   this.festvars = MyFestVars.find({})        
      // });
     

    }

    
    // getVars(key){
    //   return this.festvars[key];
    // }
    getImages():Observable<any>{     
      if(this.fest_sub_obs)
      return this.fest_sub_obs;
      ;
    }
    setEvents(e){
      this.events_sub = e
    }
    findEvents(query){
      return EventsCollection.find(query);
    }
    findEventsDyn(query){
      return Observable.create(observer => {
        MeteorObservable.subscribe('events_pub', query).zone().subscribe(()=> {
          observer.next(EventsCollection.find(query).fetch());
          observer.complete();
        });
      }); 
    }
    canActivate(){
      return Roles.userIsInRole(Meteor.userId(), ['manage-event']);
    }
    getNo(){
      return this.co;
    }

    ngOnInit() {
      
    }

    ngOnDestroy() {
      if (this.EventsListSubscription) {
        this.EventsListSubscription.unsubscribe();
      }
    }
    removeTodo(_id: string) {
      Meteor.call('removeTodo', _id);
    }
      
  }
    