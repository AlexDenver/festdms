import { Component, OnInit, NgZone } from '@angular/core';
import { ObservableCursor, MeteorObservable } from 'meteor-rxjs';
import { MyFestEvent } from 'imports/models/events';
import { Observable, Subscription, of } from 'rxjs';
import { EventsCollection } from 'imports/collections/all';
import { Router, ActivatedRoute } from '@angular/router';
import {Meteor} from 'meteor/meteor';
import  Images  from "../../../../imports/collections/images";


@Component({
  selector: 'register',
  templateUrl: 'register.html',
  styleUrls: ['register.scss']
})

export class RegisterComponent implements OnInit{
    events_sub_obs: ObservableCursor<MyFestEvent>;
    images: ObservableCursor<any>;
    events_sub: Observable<MyFestEvent[]>;
    uid;
    EventInfo: Observable<MyFestEvent>;
    route_sub;
    EventsListSubscription: Subscription;    
    IFiles: Subscription;  
    imgurl: any;
    participants:Observable<any>;
    names: Set<string>;
    collegeName;
    selectEvent: boolean;
    reg_flag
    max_parti;
    email;
    registered: Observable<boolean>;
    myForm;
    submissionReady = false;
    constructor(private route: ActivatedRoute, private zone: NgZone){
        this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(()=> {
            this.events_sub_obs = EventsCollection.find({});
            this.events_sub_obs.subscribe(c => {
              this.events_sub = c;
            })
         });
         this.participants = [];                         
         this.selectEvent = false;
         this.collegeName = '';
         this.reg_flag = false;
         this.names = new Set();
         let self = this;
         this.max_parti = 5;
            
        //  this.registered;
         
    }
    nameUpdate(){
      let self = this;
      this.names = new Set();
      self.participants.forEach(function(n){
        n.names.forEach(el => {
          self.names.add((el.name.toLowerCase().trim()));
        });                
      })
      
    }
    possible_events(ev){
      let current = this.names.size;
      let self = this;
      return ev.filter(function(e, i){
        if(((e.participants+current) < self.max_parti) && !e.used){
          let acInd = i;
          e.abs_i = i;
          return e;
        }
      })
    }
    submitForm(e,x){      
      let self = this;
      if(x.form.status=="INVALID")
      return false;
      else{
        // console.log(this.participants);
        x.reset();
        this.names = new Set();
        let participants = this.participants;
        this.participants = [];   
        this.submissionReady = true;     
        Meteor.call("registerTeam", participants,  function(err, data){
          // console.log(err, data)
          if(!err){            
            self.setRegData(data);
          }
        })
        this.reg_flag = false;
        this.registered = of(true);
        return false;
      }
    }
    setRegData(data){
      // console.log("Setting")
      self = this;

      this.zone.runTask(function(){
        self.uid = data.toUpperCase();
        self.reg_flag = false;
        self.registered = of(true);
      })
      // console.log(this.registered)
      // console.log(this.reg_flag)
      // console.log(this.uid);
    }
    startRegistration(){
      this.reg_flag = true;
    }
    removeEvent(i){
      this.participants.splice(i,1);      
      this.nameUpdate();
      this.events_sub[i].used = false;
    }
    lockEvent(i){
      this.participants[i].lock = true;
    }
    unlockEvent(i){
      this.participants[i].lock = false;
    }
    addEvent(ev, i){
      let l = this.participants.length;
      if(l > 0){
        // this.lockEvent(l-1);

      }
      this.events_sub[ev.abs_i].used = true;
      let part = {
        "lock": false,
        'icon': ev.icon,
        'event': ev.name.themed,
        'evIndex': ev.abs_i,
        'names': [],
        'contact': '',
        'scores': [],
        'college': this.collegeName,
        'code': "",
        'reg_uid': '',
        'checkin': false,
        'disqualifed': false,
        'email': this.email
      }
      this.selectEvent = false;
      for(let i = 0; i < ev.participants; i++){
        part['names'].push({name: ""});
      }      

      this.participants.push(part);
    }

    showEvents(){
      this.selectEvent = true;
    } 

    ngOnInit(): void {
      
    }
    ngOnDestroy(): void {
      this.EventsListSubscription.unsubscribe();
      
    }
}
