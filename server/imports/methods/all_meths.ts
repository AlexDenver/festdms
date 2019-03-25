import { Meteor } from 'meteor/meteor';
import { EventsCollection, MyFestVars, LogsCollection, PartiCollection } from '../../../imports/collections/all';
import Images  from "../../../imports/collections/images";
import Photos from  "../../../imports/collections/images";
import { Roles } from 'meteor/alanning:roles'
import { from } from 'rxjs';
import {MailService}  from "@sendgrid/mail"

import {Blaze} from "meteor/blaze"

let getEmail2 = (college, count,ev)=>{
  let li = '';
  ev.map((d)=>{
    li+='<li><b>'+d.event+': </b>'+d.names.map((d)=> d.name).join(',')+'</li>'
  })
  return `<html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Registered Email</title>
</head>
<body style="font-family: 'Montserrat',Helvetica, 'Century Gothic',sans-serif;">
  <div style="padding:20px; text-align: center; background: #16324F">
          <a href="http://app.abhyudayrit.com"><img src="http://ab6.herokuapp.com/assets/ab-logo.png" style="height: 15%; width: 15%" alt=""></a>
  </div>
  <div style="margin: 0 20px;">
      <h1>Yay! ${college} registered for Abhyuday 6.0 for ${count} event</h1>
      <div>
        ${college} </br> ${ev[0].email}
      </div>
      <ul>
        ${li}
      </ul>
  </div>
  <div style="padding: 10px"></div>
  <div style="margin: 0 20px">
      <p><span style="font-weight: 600;">Team AB6</span></p>
  </div><div style="padding: 10px 20px;background: #ffb20f;"> 
     <p> <img src="http://ab6.herokuapp.com/assets/rit-logo.svg" style="height: 25%; width: 25%" alt=""></p>
  </div>

</body></html>`
}

let getEmail = (d)=>{
  return `
  <!DOCTYPE html>
  <html lang="en"><head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Registered Email</title>
  </head>
  <body style="font-family: 'Montserrat',Helvetica, 'Century Gothic',sans-serif;">
      <div style="padding:20px; text-align: center; background: #16324F">
              <a href="http://app.abhyudayrit.com"><img src="http://ab6.herokuapp.com/assets/ab-logo.png" style="height: 25%; width: 25%" alt=""></a>
      </div>
      <div style="
    margin: 20px;
">
          <h1>Yay! You have successfully registered for Abhyuday 6.0</h1>
      </div>
      <div style="padding: 10px"></div>
      <div style="
    margin: 20px;
">
          <p>We will be waiting for you at our Campus, we are glad you used the online registration form and made the lives of our volunteers easier. Use the code given below, and provide it to the members of the reception committee when asked to finalise your registration.
              </p>
      </div>
      <div style="
    margin: 20px;
">
          <h1>Your Unique Code: <span style="color: #ffb20f;border: 2px dashed; margin-left: 20px; padding: 5px;">${d}</span></h1>
      </div>
      <div style="padding: 20px"></div>
      <div style="font-style: italic; font-size: smaller; text-align: center;"><span>dont forget to get a signed permission letter from your institution to be eligible for participation</span></div>
      

<div style="
    margin: 20px;
">
          <p>Thanks,<br>Regards.<br><span style="font-weight: 600;">Team AB6</span></p>
      </div><div style="padding: 10px 20px;background: #ffb20f;"> 
         <p> <img src="http://ab6.herokuapp.com/assets/rit-logo.svg" style="height: 25%; width: 25%" alt=""></p>
      </div>
  
  </body></html>
`
}

Meteor.users.after.insert(function (userId, user) {
  
  console.log(userId, user);

  if (user.profile.type === "admin") {
      Roles.addUsersToRoles(user._id, ['add-event','manage-event', 'manage-participants', 'view-participant', 'view-event', 'all', 'notif'])
  } else if (user.profile.type === "eventhead") {
      Roles.addUsersToRoles(user._id, ['manage-event', 'manage-participants', 'view-participants', 'view-event', 'notif'])
  } else if(user.profile.type==="participant") {
      Roles.addUsersToRoles(user._id, ['view-participant'])
  } else if(user.profile.type === "reception"){
    Roles.addUsersToRoles(user._id, ['manage-participants', 'view-participants', 'view-event', 'notif'])
  } else if(user.profile.type === "certificate"){
    Roles.addUsersToRoles(user._id, ['view-participants', 'view-scores', 'notif' ])
  }
});

import { FilesCollection } from 'meteor/ostrio:files';
import { PathLocationStrategy } from '@angular/common';
import { Template } from 'meteor/templating';


EventsCollection.collection.after.update(function(userId, doc, fieldNames, modifier, options){  
  LogsCollection.insert({
    user: userId,
    time: Date.now(),
    modifed: modifier,
    fieldNames: fieldNames,    
    options: options,
    doc: doc
  });
})

Meteor.methods({
  addEvent(ev: any) {
    EventsCollection.insert({
      name: ev.name,
      description: ev.description,
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
  createNewUser(d){
    return Accounts.createUser({username: d.usn, password: d.pwd, profile: {type:  d.type}})    
  },
  rem_parti(id){
    PartiCollection.remove({reg_uid: id})
    return true;
  },
  removeEvent(_id: string) {
    EventsCollection.remove({
      _id
    })
  },
  updateEvent(_id: string, ev: any){    
    EventsCollection.update({_id: _id}, ev);
  },
  changeThing(id, pass){    
    console.log(id, pass)
    Accounts.setPassword(id, pass)
  },
  userLogin(authData){    
    return Meteor.loginWithPassword(authData.username, authData.password, function(){
      return false
    });
  },
  updateIcon(old, newi, evid){
    Photos.Photos.remove({url: old});    
    EventsCollection.update({_id: evid}, {$set: {icon: newi}});
  },
  updateFestVars(vars){
    MyFestVars.update({_id: vars._id}, vars)
  },
  registerTeam(ev){
    
    


    let d = new Date().getUTCMilliseconds() % 100;
    let c = PartiCollection.find({}).fetch().length+1;
    let uid = 'AB' + (d<9?('0'+d):d) + ev[0].college.trim().slice(-2) + (c<9?('0'+c:c);
    uid = uid.toUpperCase();
    ev = ev.map((e)=>{
      e.reg_uid = uid;
      return e
    })


    var mailgun = require("mailgun-js");
    var DOMAIN = 'mg.abhyudayrit.com'
    var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});


    const msg = {
      to: ev[0].email,
      from: 'AB6 Reception Committee <greetings@abhyudayrit.com>',
      subject: 'Registartion Successful, UID: '+uid,    
      html:  getEmail(uid) //'<strong>and easy to do anywhere, even with Node.js</strong>',
    };


    const msg2 = {
      to: "dnvr.dsz@gmail.com",
      from: 'AB6 Reception Committee <greetings@abhyudayrit.com>',
      subject: 'New Registration!, UID: '+uid,
      text: 'and easy to do anywhere, even with Node.js',
      html:  getEmail2(ev[0].college, ev.length,ev) //'<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    mailgun.messages().send(msg, function (error, body) {
      console.log(body);
    });

    mailgun.messages().send(msg2, function (error, body) {
      console.log(body);
    });
    
    for(let i=0; i < ev.length; i++)
      PartiCollection.insert(ev[i]);
    

    return uid;
  },
  updateParticipant(names, id){
    PartiCollection.update({_id: id}, {$set: {names: names.names}})
  },
  checkinAll(uid){
    PartiCollection.update({reg_uid: uid}, {$set: {checkin: true}}, {multi: true});
  },
  checkinOne(id){
    PartiCollection.update({_id: id}, {$set: {checkin: true}});
  },
  applyScore(id,round,score){
    return PartiCollection.update({_id: id}, {$push: {scores: score}});
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
      color: "#ec1943",
      allPeople: []
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
  PartiCollection.allow({
    remove: function(userId, doc){
      if(Roles.userIsInRole(userId, ['all']))
      return true;
      else
      return false; 
    },
    update: function(userId, doc, fields){
      if(Roles.userIsInRole(userId, ['manage-participants', 'all']))
        return true;
      else
        return false;
    }
  })
}
