import { Component, OnInit, NgZone } from '@angular/core';
import { ObservableCursor, MeteorObservable } from 'meteor-rxjs';
import { MyFestEvent } from 'imports/models/events';
import { Observable, Subscription } from 'rxjs';
import { EventsCollection, PartiCollection } from 'imports/collections/all';
import { Router, ActivatedRoute, Route } from '@angular/router';
import {Meteor} from 'meteor/meteor';
import  Images  from "../../../../imports/collections/images";


@Component({
  selector: 'scoresheet',
  templateUrl: 'scoresheet.html',
  styleUrls: ['scoresheet.scss']
})
export class ScoreSheetComponent implements OnInit{ 
  
    menu_toggle: boolean = false;
    
    events_sub_obs: ObservableCursor<MyFestEvent>;
    score = [];
    navState:string = 'event' 
    events_sub: Observable<MyFestEvent[]>;
    event_copy: Observable<MyFestEvent>;
    event_first;
    EventsListSubscription: Subscription;
    original = true;
    imageData;
    changed = false;
    ClearSubScription:Subscription[] = [];
    currentRound= 0;
    myPartiSub: Subscription;
    parti_sub_obs: Observable<any>;
    parti_sub: Observable<any>;
    done = false;
    route_sub: any;
    rid: any = false;
    constructor( private router: Router, private zone: NgZone, private route: ActivatedRoute){
        // this.score = []
      this.ClearSubScription[0] = this.EventsListSubscription = MeteorObservable.subscribe('event_sub').subscribe(()=> {
        this.events_sub_obs = EventsCollection.find({});
        if(this.original){
          this.setEventCopy(this.events_sub_obs.fetch()[0]);
          this.score = this.events_sub_obs.fetch()[0].rounds[this.currentRound].criteria.map((ed)=>{
            return {text: ed.text, val: 0}
          })
          this.original = false;
        }
        this.events_sub_obs.subscribe(c => {
          this.events_sub = c[0];
        })
     });
  
     
     this.myPartiSub = MeteorObservable.subscribe('myParticipants').subscribe(()=>{
       console.log("here")
       this.parti_sub_obs = PartiCollection.find({reg_uid: this.rid});
       this.parti_sub_obs.subscribe(c =>{
         console.log(c)
         this.parti_sub = c[0];
         this.currentRound = c.scores.length;
       })
     })
  
  
    }

    applyScore(){
      this.done = true;
      Meteor.call("applyScore", this.parti_sub._id, this.currentRound, this.score, (err,d)=>{
        if(!err){
          toastr.success("Scores Applied!")
          this.zone.run(() => this.router.navigate(['/manage', 'scores']));
        }
      })
    }
    prepareScore(t){
        console.log(t ," Reached Here")
        this.score.push({text: t, val: 0})
        console.log(this.score)
        return ' ';
    }
    getCriterias(e){
        let d = e[this.currentRound];
        if(d){                        
            return d.criteria;
        }
        else
        return [];
    }
    setEventCopy(c){    
        console.log(c)
        c.rounds = c.rounds.map((d)=>{
          if(!d.criteria){
            d.criteria = []
          }
          return d;
        })
        this.event_copy = c;
        
      }
    setNavState(st) {
      this.navState = st;
      this.menu_toggle = false;
    }
    toggleMenu() {
        this.menu_toggle = !this.menu_toggle;
    }


    logout(){
      Meteor.logout();
    }
    ngOnInit() {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      Tracker.autorun(() => {
        let user = Meteor.user();

        if(!Roles.userIsInRole(Meteor.user(), 'manage-event')){
          console.log(Roles)
          this.zone.run(() => this.router.navigate(['/']));
        }
      });

      this.route_sub = this.route.params.subscribe(params => {
            this.rid = params['id'];
        })
  
    }
    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.ClearSubScription[0].unsubscribe();
    }
  
  }
