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
import{EventsCollection, MyFestVars, PartiCollection, NotifCollection}from'imports/collections/all';
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
    parti_sub_obs: any;
    fest_sub_obs: any;
    roles;
    events_sub: MyFestEvent[] ;
    users_sub: Observable < MyFestEvent[] > ;
    parti_data: Observable < any >
    festvars: any;
    EventsListSubscription: Subscription;
    UsersListSubscription: Subscription;
    FestVarsSubscription: Subscription;

    ClearSubScription: Subscription[] = [];

    menu_toggle: boolean = false;
    addEventActive: boolean = false;
    d: any;
    navState: string = 'events';
    upload: any;
    IFiles: Subscription;
    images: any;
    teams: any;
    team_member_count: any;
    imageData: any = '';

    NotifSubscription: Subscription;
    notif_sub_obs: any;
    notifs
    timeout = 15
    notif = {};
    
    constructor(private router: Router,private zone: NgZone) {
        this.d = "Alex"
        this.team_member_count = {}
        // this.events_sub = this.mf.findEventsDyn({})
        // this.events_sub = this.mf.findEvents({});
        this.ClearSubScription[0] = MeteorObservable.subscribe('events_sub').subscribe(() => {
            this.events_sub_obs = EventsCollection.find({});
            this.events_sub_obs.subscribe(c => {
                this.events_sub = c;
            })
        });
        

        this.ClearSubScription[1] = MeteorObservable.subscribe('users_sub').subscribe(() => {
            this.users_sub_obs = Meteor.users.find({});
            this.users_sub = this.users_sub_obs.fetch();
            // this.users_sub_obs.subscribe(c => {
            //   this.users_sub = c;
            // })
        });

        this.ClearSubScription[2] = MeteorObservable.subscribe('parti_sub').subscribe(() => {
            this.parti_sub_obs = PartiCollection.find({});
            let self = this;
            this.parti_sub_obs.subscribe(c => {
                let uid = new Set();
                this.teams = []
                this.parti_data = c.map((d)=>{
                    // console.log(d)
                    let team = {}; 
                    if(!uid.has(d.reg_uid)){
                        team['reg_uid'] = d.reg_uid;
                        team['college'] = d.college
                        team['email'] = d.email;
                        self.teams.push(team);
                        self.team_member_count[d.reg_uid] = 1
                        uid.add(d.reg_uid)
                    }else{

                        self.team_member_count[d.reg_uid] += 1
                    }
                })
                // console.log(c);
            //   this.users_sub = c;
            })
        });
        this.ClearSubScription[4] = MeteorObservable.subscribe('notifications').subscribe(()=> {
            this.notif_sub_obs = NotifCollection.find({sort: {at: -1}});
            this.notif_sub_obs.subscribe(c => {
              this.notifs = c;
            })
        });


        this.ClearSubScription[3] = MeteorObservable.subscribe('fest_vars').subscribe(() => {        
            this.fest_sub_obs = MyFestVars.find({})
            this.fest_sub_obs.subscribe(c => {
                this.festvars = c[0];     
                if(!this.festvars.options)
                    this.festvars['options'] = {};
                if(!this.festvars.teamcodes)           
                    this.festvars.teamcodes = [];
            })
        });

        // MeteorObservable.subscribe('files.images.all').subscribe(() => {
        //     this.images = Images.Images.find({})                
        // });





        console.log(this.events_sub)
        // setInterval(()=>{console.log(this.mf.findUsers())},1000)
    }
    createNotif(nForm){
        if(!(this.notif['title'] && this.notif['text'])){
            toastr.error("All Fields Are Required");
            return;
        }
        this.notif['maker'] = Meteor.userId();
        // this.notif['user'] = this.events_sub.name.themed;
        // this.notif['icon'] = this.events_sub.icon;
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
    delNotif(id){
    Meteor.call("delNotif", id, (err, data)=>{
        if(err){
        toastr.error("Error in Deleting");
        }else{
        toastr.success("Successfully Deleted.")
        }
    })
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
        let pass = prompt("Enter New: ");
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

    createUser(){
        let usn = this.evusn,
            type = this.roles,
            pwd = this.evpwd,
            cpwd = this.evconfirmpwd;
        if(pwd!=cpwd){
            toastr.error("Passwords Dont Match")
        }else{
            Meteor.call("createNewUser", {usn: usn, type: type, pwd: pwd}, function(er, data){
                if(!er){
                    toastr.success("Success!");
                }else{
                    toastr.error(er)
                }
            })
        }

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

    deleteParti(id){
        Meteor.call("rem_parti", id, function(err, d){
            if(!err)
                toastr.success("Removed.")
        })
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
                    description: '',
                    participants: 0,
                    registration_fee: 0,
                    prizemoney: [0],
                    rounds: [{
                        name: '',
                        round: 0,
                        qualifying: 0,
                        criteria: {}
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
        for(let i = 0 ; i < this.ClearSubScription.length ; i++)
            this.ClearSubScription[i].unsubscribe();
    }

    ngAfterViewInit() {

    }
}