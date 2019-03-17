import { Meteor } from 'meteor/meteor';

import { EventsCollection, MyFestVars, PartiCollection } from '../../../imports/collections/all';




Meteor.publish('events_sub', function() {
  return EventsCollection.find({});
});

Meteor.publish('event_sub', function() {
  const user = Meteor.users.findOne({_id: this.userId});
  if(user)
    return EventsCollection.find({handler: user.username});
  else
    return false;
});
Meteor.publish('fest_vars', function() {
    
    return MyFestVars.find({});
  
});

Meteor.publish('parti_sub', function() {
  return PartiCollection.find({});
});

Meteor.publish('users_sub', function() {
  return Meteor.users.find({});
});
Meteor.publish('uid_sub', function(uid) {
  return Meteor.users.find({_id: uid});
});

