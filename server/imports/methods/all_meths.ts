import { Meteor } from 'meteor/meteor';
import { EventsCollection, MyFestVars, LogsCollection, PartiCollection } from '../../../imports/collections/all';
import Images  from "../../../imports/collections/images";
import Photos from  "../../../imports/collections/images";
import { Roles } from 'meteor/alanning:roles'
import { from } from 'rxjs';
import {MailService}  from "@sendgrid/mail"

import {Blaze} from "meteor/blaze"

let getEmail2 = (college, count)=>{
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
  <div>
      <h1>Yay! ${college} registered for Abhyuday 6.0 with ${count} events</h1>
  </div>
  <div style="padding: 10px"></div>
  <div>
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
      <div>
          <h1>Yay! You have successfully registered for Abhyuday 6.0</h1>
      </div>
      <div style="padding: 10px"></div>
      <div>
          <p>We will be waiting for you at our Campus, we are glad you used the online registration form and made the lives of our volunteers easier. Use the code given below, and provide it to the members of the reception committee when asked to finalise your registration.
              </p>
      </div>
      <div>
          <h1>Your Code: <span style="color: #ffb20f;border: 2px dashed; margin-left: 20px; padding: 5px;">${d}</span></h1>
      </div>
      <div style="padding: 20px"></div>
      <div style="font-style: italic; font-size: smaller; text-align: center;"><span>dont forget to get a signed permission letter from your institution to be eligible for participation</span></div>
      

<div>
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
      Roles.addUsersToRoles(user._id, ['add-event','manage-event', 'manage-participants', 'view-participant', 'view-event', 'all'])
  } else if (user.profile.type === "eventhead") {
      Roles.addUsersToRoles(user._id, ['manage-event', 'manage-participants', 'view-participants', 'view-event'])
  } else if(user.profile.type="participant") {
      Roles.addUsersToRoles(user._id, ['view-participant'])
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
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);


    // MailService.setApiKey(process.env.SENDGRID_API_KEY);
    ev = ev.map((e)=>{
      e.reg_uid = uid;
      return e
    })
    console.log(ev);
    const msg = {
      to: ev[0].email,
      from: 'AB6 Reception Committee <greetings@abhyudayrit.com>',
      subject: 'Registartion Successful, UID: '+uid,
      text: 'and easy to do anywhere, even with Node.js',
      html:  getEmail(uid) //'<strong>and easy to do anywhere, even with Node.js</strong>',
    };


    const msg2 = {
      to: "dnvr.dsz@gmail.com",
      from: 'AB6 Reception Committee <greetings@abhyudayrit.com>',
      subject: 'New Registration!, UID: '+uid,
      text: 'and easy to do anywhere, even with Node.js',
      html:  getEmail2(ev[0].college, ev.length) //'<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail.send(msg);
    sgMail.send(msg2);

    // const sgMail = Npm.require('@sendgrid/mail');    
    
    // const msg = {
    //   to: 'dnvr.dsz@gmail.com',
    //   from: 'test@example.com',
    //   subject: 'Sending with SendGrid is Fun',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // };
    // MailService.send(msg);
    for(let i=0; i < ev.length; i++)
      PartiCollection.insert(ev[i]);
    

    return uid;
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
