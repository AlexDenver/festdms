import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';

import jQuery from 'jquery';
import {particleJS} from 'node_modules/particlesjs';

import Meteor from "meteor/meteor";
import { MyFestService } from '../myfest.services';
import { EventsCollection } from 'imports/collections/all';
import {MyFestEvent} from 'imports/models/events'
import { MeteorObservable, ObservableCursor } from 'meteor-rxjs';
import { Observable, timer, interval } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss']
})

export class HomeComponent implements AfterViewInit, OnInit { 
  @ViewChild(SwiperComponent) directiveRef?: SwiperComponent;
  ev: Observable<MyFestEvent[]>;
  timer: any;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isMobile=$(document).width()<768;
    
  events_sub_obs: ObservableCursor<MyFestEvent>;
  
  
  events_sub: Observable<MyFestEvent[]>;
  event_copy: Observable<JSON>;
  events_list;
  EventsListSubscription: Subscription;
  constructor(private mf: MyFestService){    

  //   Events.insert({
  //     name: {
  //         actual: "Test",
  //         themed: ''
  //     },
  //     participants: 0,
  //     registration_fee: 0,
  //     prizemoney: [0],
  //     rounds: [{round: 0, name: '', qualifying: 2}],
  //     rules: [''],
  //     eventHeads: [{name: '', contact: 0, dp: ''}]
  // })
  }
  config: SwiperConfigInterface = {
    // a11y: true,
    // slidesPerView: this.isMobile? 1 : 5,
    slidesPerView: 'auto',
    // slidesPerGroup: 2,
    // centeredSlides: this.isMobile? false: false,
    scrollbar: false,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: this.isMobile? 10: 20,    
    
    // observer: true,  
    // navigation: true
    
    
  };
  index = 0;
  // {
  //   "event": "Menlo Park",
  //   "participant": ["Josh"],
  //   "active": true,
  //   "eliminated": false,
  //   "checkin": true,
  //   "scores": [{"round": 1, "breakup": [], "score": 50}],
  //   "team": "Menlo",
  //   "college": "RIT",
  //   "contact": 9876543210,
  //   "email": "@mail.com",
  //   "uid": "X1WAP"
  // }	
  
  
  ngAfterViewInit(): void {
    console.log("Hello")
    console.log(particleJS);
    // particleJS("particle-js");
    window['particle']("particles-js", {
      "particles": {
        "number": {
          "value": 150,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#F0A202"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#F0A202"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 1,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#F0A202",
          "opacity": 0.4,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
        
    console.log("L2")
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
      
    
    console.log('Hello',this.ev)
  }
 
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.isMobile){
      let el = $('.person')
      // for(let i = 25; i < el.length; i++)
      //   el[i].remove();
    }
    this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(()=> {      
      this.events_sub_obs = EventsCollection.find({});
      this.events_sub_obs.subscribe(c => {
        this.events_list = c;
        console.log(c);
        setTimeout(()=>{

          this.directiveRef.update();
        }, 200)
      })
   });

    this.startTimer();
    this.initFacesBox();
  }


  imageGrid(){

  }

  startTimer(){
    const year = (new Date().getFullYear()) + 1;
    const fourthOfJuly = new Date('28 Mar 2019 9:00').getTime();
    let self = this;
    // countdown
    
    this.timer = setInterval(function() {
      console.log("Change")
      // get today's date
      const today = new Date().getTime();

      // get the difference
      const diff = fourthOfJuly - today;

      // math
      self.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      self.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      self.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      self.seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if((self.seconds%2==0)&& self.ready){
        self.ready = false;
        self.randomizePic(5);        
      }
      

    }, 1000);
  }
  randomizePic(random_face_count){
    var facesBuffer = new Array();
    for (let face_n = 0; face_n < random_face_count; face_n++) {
      
      let d = this.filled_areas.length;
      // let n = Math.floor(Math.random()*d);
      let n = 0;
      this.filled_areas.splice(n, 1);
      var elx = this.filled_el[n];
      this.filled_el.splice(n, 1);
      var selfx = this;
      var min_x = 0;
      var max_x = $('.people-wrap').outerWidth() -100;
      var counter = 0;
      var min_y = 0;
      var area;
      var max_y = $('.people-wrap').outerHeight() - 100;
      $(elx).removeClass('active').delay(500);
      var size = (80+Math.random()*(this.img_max_size));
   
      var rand_x;
      var rand_y;
      var tries = 1;
      var size_cut = 2;
      do {
          rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
          rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
          area = {x: rand_x, y: rand_y, width: size, height: size};
          if(tries==25){
            tries = 1;
            size = size/size_cut;
            console.log("Resized", size)
          }
      } while(selfx.check_overlap(area) && ++tries<=25);
      selfx.filled_areas.push(area);
      selfx.filled_el.push(elx);
      facesBuffer.push({elx: elx, dim: area});
    }


    facesBuffer.forEach((face,iterator) => {
      setTimeout(() => {
        $(face.elx).height(face.dim.width);
        $(face.elx).width(face.dim.width);
        $(face.elx).css({left:face.dim.x, top: face.dim.y});

        $(face.elx).addClass('active').find('img').attr('src', this.imgs[Math.floor(Math.random()*this.imgs.length)]);
        if(iterator==(random_face_count-1))
          selfx.ready = true;
      }, 200+(iterator*100));      

    });
    
  }

  filled_areas = new Array();
  filled_el = new Array();
  imgs = new Array();
  ready = false;
  img_max_size=this.isMobile?80:150;
  initFacesBox(){
    let selfx=this;
    var min_x = 0;
    var max_x = $('.people-wrap').outerWidth() -100;
    var counter = 0;
    var min_y = 0;
    var max_y = $('.people-wrap').outerHeight() - 100;
    console.log(max_x, max_y)
    $('.person').each(function(ix, el) {
        var rand_x=0;
        var rand_y=0;
        var area;
        let tries=1;
        var size = ((ix<5&&(!selfx.isMobile)?120:80)+Math.random()*(selfx.img_max_size));

        let size_cut = 2;
        // if()
        $.ajax({
          url: 'https://randomuser.me/api/',
          dataType: 'json',
          success: function(data) {
            $('.person img').eq(counter++).attr('src', data.results[0].picture.large).parent().addClass('active');
            selfx.imgs.push(data.results[0].picture.large)
            if(counter>=$('.person img').length-1)
              selfx.ready = true;
          },
          error: function(){
            counter++;
            // selfx.imgs.push(data.results[0].picture.large)
          }
        });
        selfx.imgs = [

        ]

        do {
            rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
            rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
            area = {x: rand_x, y: rand_y, width: size, height: size};
            if(tries==25){
              tries = 1;
              size = size/size_cut;
              console.log("Resized")
              console.log("Init",size)
            }
        } while(selfx.check_overlap(area) && (++tries<=25));
        $(this).height(size)
        $(this).width(size)
        selfx.filled_areas.push(area);
        selfx.filled_el.push($(this));
        
        $(this).css({left:rand_x, top: rand_y});
    });

    
  }
  check_overlap(area) {
    for (var i = 0; i < this.filled_areas.length; i++) {
        
        var check_area = this.filled_areas[i];
        
        var bottom1 = area.y + area.height;
        var bottom2 = check_area.y + check_area.height;
        var top1 = area.y;
        var top2 = check_area.y;
        var left1 = area.x;
        var left2 = check_area.x;
        var right1 = area.x + area.width;
        var right2 = check_area.x + check_area.width;
        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            continue;
        }
        return true;
    }
    return false;
}
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.timer)
  }
}
