import { MongoObservable } from 'meteor-rxjs';

import { MyFestEvent } from '../models/events';

const EventsCollection = new MongoObservable.Collection<MyFestEvent>('events');
const MyFestVars = new MongoObservable.Collection<any>('myfestdb');
const LogsCollection = new MongoObservable.Collection<any>('logs');
const PartiCollection = new MongoObservable.Collection<any>('participants');
const NotifCollection = new MongoObservable.Collection<any>('notifications');
export {EventsCollection, MyFestVars, LogsCollection, PartiCollection, NotifCollection}

// {
//     'event': "Web:80",
//     'names': ["John", "Eric"],
//     'contact': '',
//     'scores': [{
//         'round': 'Design Round',
//         'score': 10
//     }],
//     'college': "SJEC",
//     'code': "Juniper",
//     'reg_uid': '',
//     'checkin': true,
//     'disqualifed': false
// }