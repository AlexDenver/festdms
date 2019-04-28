# Fest Data Management System (FestDMS) [Work in-progress]
[![MIT License](https://img.shields.io/static/v1.svg?label=licence&message=MIT&color=FFB20F)](https://github.com/AlexDenver/festdms/raw/master/LICENSE)


FestDMS is a revised version of [MyFest](https://github.com/alexdenver/myfest) a College Event Management System that was built static-ally with most of the changes requiring changes to the core files, FestDMS is a more user friendly approach to the common problems faced in most of the inter College Fests while handling data. 

FestDMS helps you setup a live website which helps in the process of running a full fledged fest starting from Registrations to Results handling, with customized user-types to provide curated dashboards with relevant information at all times. 

## Targeted Audience
Although the primary audiences for FestDMS are College Fests having more than one event to manage, this application can also be used by anyone wanting to manage their comepetetive events where Online Registrations and Result management is a requirement. 

## Features
1. Customizable Landing Page [in-progress]
2. Participant Registrations
3. Participants Dashboard
    * Participants Overview (Reception Committee)
    * Participant Management (Reception Committee)
4. Event Dashboard
    * Add Events (Admin)
    * Add Event Details (Event Head)
    * Manage Event Page (Event Head)    
5. Scores Dashboard
    * Manage Scoring Criteria (Event Head)
    * Record Scores, Disqualify Participants (Event Head)
    * Scores Overview (Certificate Committee)    
6. Notifications Dashboard
    * Create Notifications (Event Head, Committee Heads)
    * Notifications View (Public User)    
7. Finances / Expenses Dashboard
    * Record Expenses (Committee Members) [in-progress]
    * Finances Overview (Finance Comittee) [in-progress]
8. Admin Dashboard
    * Manage Events
    * Manage Users
    * Manage Landing Page [in-progress]
    * Manage System Variables
    * View User Activity Logs

## Getting Started

**Prerequisites:**

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Meteor](https://www.meteor.com/install)

> Meteor automatically installs a hidden [NodeJS v8](https://nodejs.org/download/release/v8.9.3/), [Python v2.7](https://www.python.org/downloads/release/python-270/) and [MongoDB v3.6](https://www.mongodb.com/mongodb-3.6) to be used when you run your app in development mode using the `meteor` command.

Now just clone and start the app:

```sh
git clone https://github.com/AlexDenver/festdms.git festdms
cd festdms
meteor npm install
meteor run
```
this should run the instance on [http://localhost:3000](http://localhost:3000) by default. 

Start managing your local instance by logging into admin dashboard ([http://localhost:3000/auth](http://localhost:3000/auth)) the default credentials are ```username: admin, password: password``` start exploring the interface from there.



## Built Using

* [MeteorJS](http://www.meteor.com/) - Framework for Realtime Data Delivery
* [MongoDB](https://www.mongodb.com/) - Meteor Internally uses MongoDB as Data Store
* [GridFS](https://docs.mongodb.com/manual/core/gridfs/) - Storing Images in MongoDB
* [Sass](https://sass-lang.com) - CSS Preprocessor
* [Angular](https://angular.io/) - Frontend View Manipulations
* [Mailgun](https://mailgun.com) - Email Delivery