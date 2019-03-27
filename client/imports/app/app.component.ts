import { Component } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  seen = false;
  constructor(){
    if(document.cookie.search('msgSeen')>-1){
      this.seen = true;
    }
  }

  setSaveState(){
    document.cookie = "msgSeen=true";
    this.seen = true;
  }
}
