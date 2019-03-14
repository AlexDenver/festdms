import { Component, OnInit, AfterViewInit, Output, Input, NgZone } from '@angular/core';
import jQuery from 'jquery';
import { MyFestEvent } from 'imports/models/events';
import { ObservableCursor, MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { EventsCollection } from 'imports/collections/all';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import Images from 'imports/collections/images';
import {UploadFS} from 'meteor/jalik:ufs';
import { Router } from '@angular/router';
import  {Roles}  from 'meteor/alanning:roles'
import { Tracker } from 'meteor/tracker';
// import { Router } from '@angular/router';


// import {toastr} from 'meteor/flawless:meteor-toastr'


@Component({
  selector: 'event',
  templateUrl: 'event.html',
  styleUrls: ['event.scss'],
})

export class EventComponent implements OnInit { 
  
  
  
  events_sub_obs: ObservableCursor<MyFestEvent>;
  

  events_sub: Observable<MyFestEvent[]>;
  event_copy: Observable<MyFestEvent>;
  event_first;
  EventsListSubscription: Subscription;
  original = true;
  imageData;
  changed = false;
  constructor( private router: Router, private zone: NgZone){

    this.EventsListSubscription = MeteorObservable.subscribe('event_sub').subscribe(()=> {
      this.events_sub_obs = EventsCollection.find({});
      if(this.original){
        this.setEventCopy(this.events_sub_obs.fetch()[0]);
        this.original = false;
      }
      this.events_sub_obs.subscribe(c => {
        this.events_sub = c[0];
      })
   });
  }
  setEventCopy(c){
    
    this.event_copy = c;
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

  }

}
