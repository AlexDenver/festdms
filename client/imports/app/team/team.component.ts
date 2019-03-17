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

    parti_sub_obs: Observable<any>
    parti_sub_obs_id: Observable<any>
    teams: any;
    team_member_count: any = {};
    parti_data: Observable<any>;
    content: string;
    route_sub: any;
    id: any = false;
    members: any;
    constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute){
        MeteorObservable.subscribe('parti_sub').subscribe(() => {
            
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

    } // CONSTRUCTOR ENDS.




    ngOnInit(){
        Tracker.autorun(async () => {
            let user = await Meteor.user();
            // vendors permission
            // console.log("Meteor")
            if(!Roles.userIsInRole(Meteor.user(), ['all', 'manage-participants'])){
                // console.log(Roles)
                this.zone.run(() => this.router.navigate(['/']));
            }
        });


        this.route_sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        })
    }

}
