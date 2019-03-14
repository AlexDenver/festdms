import { MongoObservable } from 'meteor-rxjs';

import { MyFestEvent } from '../models/events';

const EventsCollection = new MongoObservable.Collection<MyFestEvent>('events');
const MyFestVars = new MongoObservable.Collection<any>('myfestdb');
export {EventsCollection, MyFestVars}

