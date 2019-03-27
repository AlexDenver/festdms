import { Component, OnInit, AfterViewInit, Output, Input, NgZone, PipeTransform, Pipe } from '@angular/core';
import jQuery from 'jquery';
import { MyFestEvent } from 'imports/models/events';
import { ObservableCursor, MeteorObservable } from 'meteor-rxjs';
import { Observable, Subscription } from 'rxjs';
import { EventsCollection, PartiCollection, NotifCollection } from 'imports/collections/all';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import Images from 'imports/collections/images';
import {UploadFS} from 'meteor/jalik:ufs';
import { Router, ActivatedRoute } from '@angular/router';
import  {Roles}  from 'meteor/alanning:roles'
import { Tracker } from 'meteor/tracker';
// import { Router } from '@angular/router';
import {ArraySortPipe} from "../app.pipe";
import { timingSafeEqual } from 'crypto';
import {SafeHtmlPipe} from "../eventpub/eventpub.component"
// import {toastr} from 'meteor/flawless:meteor-toastr'





@Component({
  selector: 'event',
  templateUrl: 'event.html',
  styleUrls: ['event.scss']
})

export class EventComponent implements OnInit { 
  
  menu_toggle: boolean = false;
  
  events_sub_obs: ObservableCursor<MyFestEvent>;
  
  navState:string = 'event' 
  events_sub: Observable<MyFestEvent[]>;
  event_copy: Observable<MyFestEvent>;
  event_first;
  EventsListSubscription: Subscription;
  original = true;
  imageData;
  changed = false;
  ClearSubScription:Subscription[] = [];
  route_sub: any;
  myPartiSub: Subscription;
  parti_sub_obs: Observable<any>;
  parti_sub: Observable<any>;
  sorted_parti: Observable<any>;

  NotifSubscription: Subscription;
  notif_sub_obs: any;
  notifs
  timeout = 15
  notif = {};
  constructor( private router: Router, private zone: NgZone, private route: ActivatedRoute){
    this.notif.autodelete = true;
    this.notif.color = 'yellow';
    this.ClearSubScription[0] = this.EventsListSubscription = MeteorObservable.subscribe('event_sub').subscribe(()=> {
      this.events_sub_obs = EventsCollection.find({});
      if(this.original){
        this.setEventCopy(this.events_sub_obs.fetch()[0]);
        this.original = false;
      }
      this.events_sub_obs.subscribe(c => {
        this.events_sub = c[0];
      })
   });
   let self = this;
   Meteor.call("getNotifTimeout", (e,d)=>{
     if(!e)
      self.timeout = Math.round(d);
   });
   this.NotifSubscription = MeteorObservable.subscribe('notifications').subscribe(()=> {
        this.notif_sub_obs = NotifCollection.find({maker: Meteor.userId(), {sort: {at: -1}});
        this.notif_sub_obs.subscribe(c => {
          this.notifs = c;
        })
    });
   
   this.myPartiSub = MeteorObservable.subscribe('myParticipants').subscribe(()=>{
     console.log("here")
     this.parti_sub_obs = PartiCollection.find({});
     this.parti_sub_obs.subscribe(c =>{
       console.log(c)
       c.map((cp=>{
         let total = 0;
         cp.scores.map((sc)=>{
           sc.map((v)=>{

             total += v.val;
           })
         })
         cp.total = total;
       }))
       this.parti_sub = c;
       
        this.sorted_parti = this.parti_sub;
        // this.sorted_parti.sort();
        this.sorted_parti.sort(function(a, b) {          
          
             return a.total - b.total ;
        }).reverse();
        
        console.log(this.sorted_parti);

     })
   })


  }
  createNotif(nForm){
    if(!(this.notif['title'] && this.notif['text'])){
      toastr.error("All Fields Are Required");
      return;
    }
    this.notif['maker'] = Meteor.userId();
    this.notif['user'] = this.events_sub.name.themed;
    this.notif['icon'] = this.events_sub.icon;
    this.notif['at'] = new Date().getTime();
    console.log(this.notif) 
    Meteor.call("createNotif", this.notif, (err, data)=>{
      if(err){
        toastr.error("Error.")
      }else{
        nForm.reset();
      }
      // console.log(data)
    })
  }
  setNavState(st) {
    this.navState = st;
    this.menu_toggle = false;
  }
  toggleMenu() {
      this.menu_toggle = !this.menu_toggle;
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
  delNotif(id){
    Meteor.call("delNotif", id, (err, data)=>{
      if(err){
        toastr.error("Error in Deleting");
      }else{
        toastr.success("Successfully Deleted.")
      }
    })
  }
  disqualify(id, uid, $event){
    $event.stopPropagation(); // Only seems to
    $event.preventDefault();
    if(confirm("Are you Sure you want to Knock Out: " + uid)){
      Meteor.call("knockOut", id, (err, data)=>{
        if(!err)
          toastr.success("Participant Knocked Out.");    
        else
          toastr.error("Error Occured.");    
      })
    }else{
      toastr.warning("Knock-out Cancelled.");      
    }
  }
  save(){
    Meteor.call('updateEvent', this.event_copy._id ,this.event_copy, function(err, res){
      if(err){
        console.log("Error", err)
      }else{
        console.log("Success", res, err)
        toastr.success("Event Updated")

      }
    });
  }
  upload;
  onFileChange(e, eventCopy, ei) {
    
    let self = this;
  console.log(eventCopy)
    let d = UploadFS.selectFile(function (file) {
        // Prepare the file to insert in database, note that we don't provide a URL,
        // it will be set automatically by the uploader when file transfer is complete.
        let photo = {
            name: file.name,
            size: file.size,
            type: file.type,
            event: eventCopy.name.themed,
            contact: eventCopy.eventHeads[ei].contact,
            ename: eventCopy.eventHeads[ei].name
        };

        // Create a new Uploader for this file
        let uploader = new UploadFS.Uploader({
            // This is where the uploader will save the file
            // since v0.6.7, you can pass the store instance or the store name directly
            store: Images.Images || 'photos',
            // Optimize speed transfer by increasing/decreasing chunk size automatically
            adaptive: true,
            // Define the upload capacity (if upload speed is 1MB/s, then it will try to maintain upload at 80%, so 800KB/s)
            // (used only if adaptive = true)
            capacity: 0.8, // 80%
            // The size of each chunk sent to the server
            chunkSize: 8 * 1024, // 8k
            // The max chunk size (used only if adaptive = true)
            maxChunkSize: 128 * 1024, // 128k
            // This tells how many tries to do if an error occurs during upload
            maxTries: 5,
            // The File/Blob object containing the data
            data: file,
            // The document to save in the collection
            file: photo,
            // The error callback
            onError(err, file) {
                console.error(err);
            },
            onAbort(file) {
                console.log(file.name + ' upload has been aborted');
            },
            onComplete(file) {
                console.log(file.name + ' has been uploaded');
                console.log(file)
                self.imageData = file;
                self.event_copy.eventHeads[ei].dp = file.url;
            },
            onCreate(file) {
                console.log(file.name + ' has been created with ID ' + file._id);
            },
            onProgress(file, progress) {
                console.log(file.name + ' ' + (progress*100) + '% uploaded');
            },
            onStart(file) {
                console.log(file.name + ' started');
            },
            onStop(file) {
                console.log(file.name + ' stopped');
            },
        });

        // Starts the upload
        uploader.start();

        // // Stops the upload
        // uploader.stop();

        // // Abort the upload
        // uploader.abort();
    });


    // console.log(d)
  }
  logout(){
    Meteor.logout();
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    Tracker.autorun(() => {
      let user = Meteor.user();
      // vendors permission
      console.log("Meteor")
      if(!Roles.userIsInRole(Meteor.user(), 'manage-event')){
        console.log(Roles)
        this.zone.run(() => this.router.navigate(['/']));
      }
    });


    this.route_sub = this.route.params.subscribe(params => {      
      this.navState = params['state']
    })

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ClearSubScription[0].unsubscribe();
  }

}




