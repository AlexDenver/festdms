import { Meteor } from 'meteor/meteor';

import { EventsCollection } from '../../../imports/collections/all';




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

Meteor.publish('users_sub', function() {
  return Meteor.users.find({});
});
Meteor.publish('uid_sub', function(uid) {
  return Meteor.users.find({_id: uid});
});

