import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/imports/collections/db.js';

export class DatabaseService {

    private Conn: any;

    constructor() {        
    }

     public newConnection(dbUrl) {
        Meteor.call('connectDB', dbUrl, function(err, response) {
           this.Conn= response;
        });
     }

     public setConn(conn) {
         this.Conn= conn;
     }

     public getConn(): any {
         return this.Conn;
     }


}