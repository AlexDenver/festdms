import { Component, OnInit } from '@angular/core';
import { NotifCollection } from 'imports/collections/all';
import { MeteorObservable } from 'meteor-rxjs';

@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html',
    styleUrls: ['notifications.scss']
  })
  
  export class NotificationsComponent implements OnInit {
    NotifSubscription: Subscription;
    notif_sub_obs: any;
    notifs
    constructor(){
        // cookie.set()
        this.NotifSubscription = MeteorObservable.subscribe('notifications').subscribe(()=> {
          this.notif_sub_obs = NotifCollection.find({});
          this.notif_sub_obs.subscribe(c => {
            this.notifs = c;
          })
       });
    }
  }