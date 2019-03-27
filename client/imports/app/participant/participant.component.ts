import { Component, OnInit } from '@angular/core';
import { Cookies } from 'meteor/ostrio:cookies';
const cookie = new Cookies();

@Component({
    selector: 'participant',
    templateUrl: 'participant.html',
    styleUrls: ['participant.scss']
  })
  
  export class ParticipantComponent implements OnInit {
    constructor(){
        // cookie.set()
    }
  }