import { Meteor } from 'meteor/meteor';
import { EventsCollection, MyFestVars } from '../../../imports/collections/all';
import Images  from "../../../imports/collections/images";
import Photos from  "../../../imports/collections/images";
import { Roles } from 'meteor/alanning:roles'
import { from } from 'rxjs';


Meteor.users.after.insert(function (userId, user) {
  
  console.log(userId, user);

  if (user.profile.type === "admin") {
      Roles.addUsersToRoles(user._id, ['add-event','manage-event', 'manage-participants', 'view-participant', 'view-event', 'all'])
  } else if (user.profile.type === "eventhead") {
      Roles.addUsersToRoles(user._id, ['manage-event', 'manage-participants', 'view-participants', 'view-event'])
  } else if(user.profile.type="participant") {
      Roles.addUsersToRoles(user._id, ['view-participant'])
  }
});

import { FilesCollection } from 'meteor/ostrio:files';
import { PathLocationStrategy } from '@angular/common';




Meteor.methods({
  addEvent(ev: any) {
    EventsCollection.insert({
      name: ev.name,
      participants: ev.participants,
      registration_fee: ev.reg_fee,
      prizemoney: ev.prizemoney,
      rounds: ev.rounds,
      rules: ev.rules,
      eventHeads: ev.eventHeads,
      handler: ev.handler,
      fees: ev.fees,
      icon: ev.icon
    });
  },
  removeEvent(_id: string) {
    EventsCollection.remove({
      _id
    })
  },
  updateEvent(_id: string, ev: any){    
    EventsCollection.update({_id: _id}, ev);
  },
  userLogin(authData){    
    return Meteor.loginWithPassword(authData.username, authData.password, function(){
      return false
    });
  },
  updateIcon(old, newi, evid){
    Photos.Photos.remove({url: old});    
    EventsCollection.update({_id: evid}, {$set: {icon: newi}});
  }
})




if (Meteor.isServer) {
  if ( Meteor.users.find().count() === 0 ) {
      let idx = Accounts.createUser({
          username: 'admin',
          email: 'dnvr.dsz@gmail.com',
          password: 'appleboxspace',
          profile: {
              first_name: 'Alex',
              last_name: 'Denver',     
              type: 'admin'
          },
        
      });

      Roles.addUsersToRoles(idx, ['add-event','manage-event', 'manage-participants', 'view-participant', 'view-event', 'all'])
  }

  if(MyFestVars.find({}).fetch().length===0){
    MyFestVars.insert({
      name: "MyFest",
      color: "#ec1943"
    })
  }

  // Meteor.publish('files.images.all', function () {
  //   return Images.find().cursor;
  // });


  Meteor.users.allow({
    remove: function(userId, doc) {
      console.log(userId)
      console.log(doc)
      if(Roles.userIsInRole(userId, ['all']))
      return true;
      else
      return false;
    }
  });

  EventsCollection.allow({
    update: function(userId, doc, fields){
      const user = Meteor.users.findOne({_id: this.userId});
      return ((Roles.userIsInRole(userId, ['manage-event']) && doc.handler==user.username) || user.profile.type=='admin')
        
    }
  })
}
