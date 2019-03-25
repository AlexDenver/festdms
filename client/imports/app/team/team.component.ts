import { Component, OnInit, NgZone } from '@angular/core';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { PartiCollection } from 'imports/collections/all';
import { Observable } from 'rxjs';
import  {Roles}  from 'meteor/alanning:roles'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'team',
  templateUrl: 'team.html',
  styleUrls: ['team.scss']
})

export class TeamComponent implements OnInit {
    menu_toggle: boolean = false;

    parti_sub_obs: Observable<any>
    parti_sub_obs_id: Observable<any>
    teams: any;
    team_member_count: any = {};
    checkin_all: any = {};
    parti_data: Observable<any>;
    content: string;
    route_sub: any;
    id: any = false;
    canEdit: boolean = false;
    members: any;
    save: {};
    ParitcipantSubscription: Subscription;
    constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute){
        this.save = {};
        this.ParitcipantSubscription = MeteorObservable.subscribe('parti_sub').subscribe(() => {
            
            if(this.id)
                this.parti_sub_obs_id = PartiCollection.find({reg_uid: this.id});
            else
                this.parti_sub_obs = PartiCollection.find({});                
            let self = this;
            if(this.id)
                this.parti_sub_obs_id.subscribe(d => {
                    this.members = d;
                })
            else
                
                this.parti_sub_obs.subscribe(c => {
                    // console.log(c)
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
                            self.team_member_count[d.reg_uid] = 1;
                            self.checkin_all[d.reg_uid] = d.checkin;
                            uid.add(d.reg_uid)
                        }else{
                            self.checkin_all[d.reg_uid] = self.checkin_all[d.reg_uid] && d.checkin;
                            self.team_member_count[d.reg_uid] += 1
                        }
                    })
                    // console.log(c);
                //   this.users_sub = c;
                })
        });

    } // CONSTRUCTOR ENDS.
    

    updateParticipant(id, names){
        console.log(id, names);
        self = this;
        Meteor.call("updateParticipant", names, id, (err, d)=>{
            if(!err){
                toastr.success(`Updated.`)
                self.save[id] = false;
            }else{
                toastr.error("Error.", err);
            }
        })
    }
    showSave(i){
        this.save[i] = true;
    }
    checkinParticipant(id){
        let self = this;
        if(this.id!='' || this.members.length > 0)
            Meteor.call("checkinOne", id, (err, d)=>{
                if(!err){
                    toastr.success(`Checkin Successful.`)
                }
            })
        else
            toastr.error("Invalid/Empty Participant Data.")
    }
    checkinAll(){
        let self = this;
        if(this.id!='' || this.members.length > 0)
            Meteor.call("checkinAll", this.id, (err, d)=>{
                if(!err){
                    toastr.success(`Checked-in ${self.members.length} Participants`)
                }
            })
        else
            toastr.error("Invalid/Empty Participant Data.")
    }
    ngOnInit(){
        Tracker.autorun(async () => {
            let user = Meteor.user();
            // vendors permission
            // console.log("Meteor")
            if(!Roles.userIsInRole(user, ['all', 'view-participants', 'manage-participants'])){
                // console.log(Roles)
                this.zone.run(() => this.router.navigate(['/']));
            }
            if(Roles.userIsInRole(user,['manage-participants', 'all'])){
                this.canEdit = true;
            }
        });


        this.route_sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        })
    }
    ngOnDestroy(): void {
        this.ParitcipantSubscription.unsubscribe()
        
    }

}
