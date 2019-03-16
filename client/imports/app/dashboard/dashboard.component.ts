import{Component,OnInit,AfterViewInit,Inject,NgZone, Input}from'@angular/core';
import jQuery from'jquery';
import{Router}from'@angular/router';
import {UploadFS} from 'meteor/jalik:ufs';
import {LocalStore} from 'meteor/jalik:ufs-local';
import  {Roles}  from 'meteor/alanning:roles'
import{MyFestService}from'../myfest.services';
import{Observable}from'rxjs';
import{MyFestEvent}from'imports/models/events';
import{MeteorObservable,zoneOperator,ObservableCursor}from'meteor-rxjs';
import{EventsCollection, MyFestVars}from'imports/collections/all';
import Images from'imports/collections/images';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.html',
    styleUrls: ['dashboard.scss']
})





export class DashboardComponent implements AfterViewInit, OnInit {
    data: any;
    self = this;
    // event: any;
    user: Meteor.User;
    evname: any;
    new_ev_form;
    evusn: any;
    no: Observable < number > ;
    evpwd: any;
    evconfirmpwd: any;
    events_sub_obs: ObservableCursor < MyFestEvent > ;
    users_sub_obs: any;
    fest_sub_obs: any;

    events_sub: MyFestEvent[] ;
    users_sub: Observable < MyFestEvent[] > ;
    festvars: any;
    EventsListSubscription: Subscription;
    UsersListSubscription: Subscription;
    FestVarsSubscription: Subscription;


    menu_toggle: boolean = false;
    addEventActive: boolean = false;
    d: any;
    navState: string = 'events';
    upload: any;
    IFiles: Subscription;
    images: any;
    imageData: any = '';
    constructor(private router: Router,private zone: NgZone) {
        this.d = "Alex"
        // this.events_sub = this.mf.findEventsDyn({})
        // this.events_sub = this.mf.findEvents({});
        MeteorObservable.subscribe('events_sub').subscribe(() => {
            this.events_sub_obs = EventsCollection.find({});
            this.events_sub_obs.subscribe(c => {
                this.events_sub = c;
            })
        });

        MeteorObservable.subscribe('users_sub').subscribe(() => {
            this.users_sub_obs = Meteor.users.find({});
            this.users_sub = this.users_sub_obs.fetch();
            // this.users_sub_obs.subscribe(c => {
            //   this.users_sub = c;
            // })
        });

        MeteorObservable.subscribe('fest_vars').subscribe(() => {        
            this.fest_sub_obs = MyFestVars.find({})
            this.fest_sub_obs.subscribe(c => {
                this.festvars = c[0];                
            })
        });

        // MeteorObservable.subscribe('files.images.all').subscribe(() => {
        //     this.images = Images.Images.find({})                
        // });





        console.log(this.events_sub)
        // setInterval(()=>{console.log(this.mf.findUsers())},1000)
    }
    setNavState(st) {
        this.navState = st;
        this.menu_toggle = false;
    }
    updateVars(){
        console.log("Update", this.festvars)
        Meteor.call('updateFestVars', this.festvars);
    }
    logout() {
        Meteor.logout();
        this.router.navigate(['auth'])
    }

    toggleMenu() {
        this.menu_toggle = !this.menu_toggle;
    }

    addEventStart() {

        this.addEventActive = true;
    }
    cancelAddEvent() {
        this.addEventActive = false;
        let d = document.getElementById('addEventForm');
        d.reset();
        return false;
    }
    changeThing(user){
        let pass = input("Enter New: ");
        Meteor.call("changeThing", user, pass, function(er, d){
            if(!er){
                toastr.success("Thing Updated.")
            }
        })
    }
    onFileChangeDep(e) {
        console.log(e)
        e = document.getElementById('evicon');
        this.upload = Images.Images.insert({
            file: e.files[0],
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: {
                event: this.evname,
             
            }
        }, false) ;

        this.upload.on('start', function () {
            // template.currentUpload.set(this);
            console.log()
        });
        let self = this;
        this.upload.on('end', function (error, fileObj) {
            if (error) {
                alert('Error during upload: ' + error);
            } else {
                // alert('File "' + fileObj.name + '" successfully uploaded');
                console.log(fileObj)
                self.imageData = fileObj;
            }
            // template.currentUpload.set(false);
            console.log("End");
        });

        this.upload.start();

    }


    onFileChange(){
        let self = this;

        let d = UploadFS.selectFile(function (file) {
            // Prepare the file to insert in database, note that we don't provide a URL,
            // it will be set automatically by the uploader when file transfer is complete.
            let photo = {
                name: file.name,
                size: file.size,
                type: file.type,
                event: self.evname,
                handler: self.evusn
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


        console.log(d)
 
    }

    updateIcon(old, evid){
        let self = this;

        let d = UploadFS.selectFile(function (file) {
            // Prepare the file to insert in database, note that we don't provide a URL,
            // it will be set automatically by the uploader when file transfer is complete.
            let photo = {
                name: file.name,
                size: file.size,
                type: file.type,
                event: self.evname,
                handler: self.evusn
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
                    Meteor.call("updateIcon", old, file.url, evid)
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


        console.log(d)
 
    }

    createEvent() {
        let self = this;
        if (this.evname.length > 0 && this.evusn.length > 0 && this.evpwd.length > 0 && this.evconfirmpwd.length > 0) {
            if (this.evpwd == this.evconfirmpwd) {
                let ev: MyFestEvent = {
                    name: {
                        actual: this.evname,
                        themed: ''
                    },
                    fees: 0,
                    participants: 0,
                    registration_fee: 0,
                    prizemoney: [0],
                    rounds: [{
                        name: '',
                        round: 0,
                        qualifying: 0
                    }],
                    rules: [''],
                    eventHeads: [{
                        name: '',
                        contact: 0,
                        dp: ''
                    }],
                    handler: this.evusn,
                    icon: this.imageData.url
                }

                Accounts.createUser({
                    username: this.evusn,
                    password: this.evconfirmpwd,
                    profile: {
                        type: 'eventhead'
                    }
                }, function (err) {
                    if (err)
                        console.warn(err);
                    else {
                        Meteor.call('addEvent', ev)
                        // EventsCollection.insert(ev);
                        console.log("Success");
                        self.cancelAddEvent();

                    }
                })
            }
        }
    }
    deleteEvent(_id) {
        Meteor.call('removeEvent', _id);
    }
    deleteUser(_id) {
        Meteor.users.remove(_id);
    }
    currentUser() {
        return this.user;
    }
    ngOnInit() {
        Tracker.autorun(() => {
            let user = Meteor.user();
            // vendors permission
            console.log("Meteor")
            if(!Roles.userIsInRole(Meteor.user(), 'all')){
              console.log(Roles)
              this.zone.run(() => this.router.navigate(['/']));
            }
          });

        if (!Meteor.userId())
            this.router.navigate(['auth']);
        else {
            // console.log("This")
            // Meteor.subscribe('toDoList')
            // console.log(this.myfest.findUsers())    
            // this.EventsListSubscription = MeteorObservable.subscribe('events_pub').subscribe(() => {        
            //     // this.setEvents(EventsCollection.find({}));
            //     this.events_sub = EventsCollection.find({});
            // }); 
            this.getEvents({});



        }
    }
    getEvents(query) {
        // return Observable.create(observer => {
        //     MeteorObservable.subscribe('events_pub', query).pipe(zoneOperator()).subscribe(()=> {
        //       observer.next(EventsCollection.find(query).fetch());
        //       observer.complete();
        //     });
        //   }); 
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit() {

    }
}