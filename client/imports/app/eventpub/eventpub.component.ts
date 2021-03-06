import { Component, OnInit } from '@angular/core';
import { ObservableCursor, MeteorObservable } from 'meteor-rxjs';
import { MyFestEvent } from 'imports/models/events';
import { Observable, Subscription } from 'rxjs';
import { EventsCollection } from 'imports/collections/all';
import { Router, ActivatedRoute } from '@angular/router';
import {Meteor} from 'meteor/meteor';
import  Images  from "../../../../imports/collections/images";


@Component({
  selector: 'eventpub',
  templateUrl: 'eventpub.html',
  styleUrls: ['eventpub.scss']
})
export class EventpubComponent implements OnInit{
    events_sub_obs: ObservableCursor<MyFestEvent>;
    images: ObservableCursor<any>;
    events_sub: Observable<MyFestEvent[]>;
    id;
    EventInfo: Observable<MyFestEvent>;
    route_sub;
    EventsListSubscription: Subscription;    
    IFiles: Subscription;  
    imgurl: any;
    constructor(private route: ActivatedRoute){
        // this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(()=> {
        //     this.events_sub_obs = EventsCollection.find({});
        //     this.events_sub_obs.subscribe(c => {
        //       this.events_sub = c;
        //     })
        //  });
         
         
         // console.log(route.params)

    }
    ngOnInit(): void {
        
        this.route_sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            
            // console.log(EventsCollection.find({}).fetch())
            
            this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(()=> {
                let ev = this.id.split('-').join(' ')
                this.events_sub_obs = EventsCollection.find({"name.themed": { $regex: new RegExp('^' + ev.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') }});
                this.events_sub_obs.subscribe(c => {
                  this.EventInfo = c[0];
                  

                })
             });
             let self = this;
             
            
         });


         
    }
    ngOnDestroy(): void {
      this.EventsListSubscription.unsubscribe();
      
    }
}



import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
