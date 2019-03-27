import { Meteor } from 'meteor/meteor';

import { EventsCollection, MyFestVars, PartiCollection, NotifCollection } from '../../../imports/collections/all';



Meteor.publish('events_sub', function() {
  return EventsCollection.find({});
});

Meteor.publish('notifications', function() {
  let all = NotifCollection.find({deleted: false, autodelete: true}).fetch();
  let timeout = MyFestVars.find().fetch()[0].options.timeout | (15*60*1000);
  all.map((noti=>{
    if((new Date().getTime() - noti.at) > (timeout)){
      NotifCollection.update({_id: noti._id}, {$set: {deleted: true}})
    }
  }))

  return NotifCollection.find({deleted: false}, {sort: {at: -1}});
});

Meteor.publish('event_sub', function() {
  const user = Meteor.users.findOne({_id: this.userId});
  if(user)
    return EventsCollection.find({handler: user.username});
  else
    return false;
});

Meteor.publish('myParticipants', function() {
  const user = Meteor.users.findOne({_id: this.userId});
  if(user){
    let ev =  EventsCollection.findOne({handler: user.username});
    return PartiCollection.find({event: ev.name.themed})
  }else
    return false;
});


Meteor.publish('fest_vars', function() {
    
    return MyFestVars.find({});
  
});

Meteor.publish('parti_sub', function() {
  if(Meteor.user().profile.type=='certificate')
    return PartiCollection.find({checkin: true});
  else
    return PartiCollection.find({});
});

Meteor.publish('users_sub', function() {
  return Meteor.users.find({});
});
Meteor.publish('uid_sub', function(uid) {
  return Meteor.users.find({_id: uid});
});

