import { MongoObservable } from 'meteor-rxjs';

import { MyFestEvent } from '../models/events';

const EventsCollection = new MongoObservable.Collection<MyFestEvent>('events');
const MyFestVars = new MongoObservable.Collection<any>('myfestdb');
const LogsCollection = new MongoObservable.Collection<any>('logs');
export {EventsCollection, MyFestVars, LogsCollection}

