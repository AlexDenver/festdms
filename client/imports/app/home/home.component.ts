import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';

import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';

import jQuery from 'jquery';
import {particleJS} from 'node_modules/particlesjs';

import Meteor from "meteor/meteor";
import { MyFestService } from '../myfest.services';
import { EventsCollection } from 'imports/collections/all';
import {MyFestEvent} from 'imports/models/events'
import { MeteorObservable, ObservableCursor } from 'meteor-rxjs';
import { Observable, timer, interval, of } from 'rxjs';

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
  rounds: number = 0;
  isMobile=$(document).width()<768;
  is_faces_init:boolean = false;
  events_sub_obs: ObservableCursor<MyFestEvent>;
  particleObj;
  diff=1;
  hideTimer=false;
  events_sub: Observable<MyFestEvent[]>;
  event_copy: Observable<JSON>;
  events_list = [];
  EventsListSubscription: Subscription;
  filled_areas = new Array();
  filled_el = new Array();
  imgs = [];
  ready = false;
  img_max_size=this.isMobile?120:150;
  constructor(private mf: MyFestService, private zone: NgZone){    
    

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
    slidesPerView: this.isMobile? 1.14 : 4,
    slidesPerGroup: this.isMobile?1 :3,
    centeredSlides: this.isMobile? true: false,
    scrollbar: false,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: this.isMobile? 10: 20,    
    initialSlide: this.isMobile?1:0
    observer: true,  
    autoplay: this.isMobile?2500: 0,
    autoplayDisableOnInteraction: false
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
  
  initParticle(i=1){
    this.particleObj = window['particle']("particles-js", {
      "particles": {
        "number": {
          "value": 150*i,
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
          "value": 3*i,
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
          "distance": 150*i,
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
        "detect_on": "window",
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
  }
  ngAfterViewInit(): void {
    //// console.log("Hello")
    //// console.log(particleJS);
    // particleJS("particle-js");
    
    this.initParticle(1)
    //// console.log("L2")
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
      
    
    //// console.log('Hello',this.ev)
  }
 
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.isMobile){
      let el = $('.person')
      // for(let i = 25; i < el.length; i++)
      //   el[i].remove();
    }
    
    let selfx = this;
    this.EventsListSubscription = MeteorObservable.subscribe('events_sub').subscribe(()=> {      
      this.events_sub_obs = EventsCollection.find({});
      this.events_sub_obs.subscribe(c => {
        this.events_list = c;
        selfx.rounds  =0;
        c.map((function(e){
          selfx.rounds += e.rounds.length;
        }))
        // //// console.log(c);
        if(!this.is_faces_init){
          this. is_faces_init =true;
          setTimeout(()=>{
            selfx.mf.getImages().subscribe(c => {
              selfx.imgs = c[0].allPeople;
              if(c[0].options.festDay){

                console.log(c[0].options.festDay);
                selfx.festDay = new Date(c[0].options.festDay).getTime() 
                selfx.hideTimer = false;
              }
                selfx.initParticle(1);
             //  // console.log(c)
             selfx.initFacesBox();
            })
          },2500)
        }
        setTimeout(()=>{
          if(selfx.directiveRef)
            selfx.directiveRef.update();
        }, 200)
      })
   });
  //  // console.log("Hello Here.")
  //  // console.log(this.mf.getImages())
   
    
    this.startTimer();
  }


  imageGrid(){

  }

  festDay = new Date('28 Mar 2019 9:00').getTime();
  startTimer(){
    const year = (new Date().getFullYear()) + 1;
    // festDay = new Date('27 Mar 2019 18:14:00').getTime();
    let self = this;
    // countdown
    
    let exploded = false;
    this.timer = setInterval(function() {
      ////// console.log("Change")
      // get today's date
      const today = new Date().getTime();

      // get the difference
      self.diff = self.festDay - today;
      // math
      self.seconds = Math.floor((self.diff % (1000 * 60)) / 1000);
      if(self.diff > 0){

        self.days = Math.floor(self.diff / (1000 * 60 * 60 * 24));
        self.hours = Math.floor((self.diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        self.minutes = Math.floor((self.diff % (1000 * 60 * 60)) / (1000 * 60));
      }else{
        // this.hideTimer.set(true);        
        self.zone.runTask(()=>{
          self.hideTimer = true;
          // console.log(self.diff)
          if(self.diff<=0 && self.diff>-2500 && !exploded){
            // Future Scope.
            exploded = true;
            // this.particleObj.destroy();
            self.initParticle(1.7)
          }

        })
      }
      
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
      // console.log(this.filled_areas, this.filled_el);
      var selfx = this;
      var min_x = 0;
      var max_x = $('.people-wrap').outerWidth() -100;
      var counter = 0;
      var min_y = 0;
      var area;
      var max_y = $('.people-wrap').outerHeight() - 100;
      $(elx).removeClass('active').delay(500);
      var size = (120+Math.random()*(this.img_max_size));
   
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
            ////// console.log("Resized", size)
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

        $(face.elx).addClass('active').find('img').attr('src', this.imgs[selfx.imgs[Math.floor(Math.random()*selfx.imgs.length)%selfx.imgs.length].url]);
        if(iterator==(random_face_count-1))
          selfx.ready = true;
      }, 200+(iterator*100));      

    });
    
  }

  
  initFacesBox(){
    let selfx=this;
    var min_x = 0;
    var max_x = $('.people-wrap').outerWidth() -100;
    var counter = 0;
    var min_y = 0;
    var max_y = $('.people-wrap').outerHeight() - 100;
    ////// console.log(max_x, max_y)
    $('.person').each(function(ix, el) {
        var rand_x=0;
        var rand_y=0;
        var area;
        let tries=1;
        var size = ((ix<5&&(!selfx.isMobile)?120:120)+Math.random()*(selfx.img_max_size));
        let size_cut = 2;        
        $('.person img').eq(counter++).attr('src', selfx.imgs[Math.floor(Math.random()*selfx.imgs.length)%selfx.imgs.length].url).parent().addClass('active');
        

        
          
        // if()
        // $.ajax({
        //   url: 'https://randomuser.me/api/',
        //   dataType: 'json',
        //   success: function(data) {
        //     $('.person img').eq(counter++).attr('src', data.results[0].picture.large).parent().addClass('active');
        //     selfx.imgs.push(data.results[0].picture.large)
        //     if(counter>=$('.person img').length-1)
        //       selfx.ready = true;
        //   },
        //   error: function(){
        //     counter++;
        //     // selfx.imgs.push(data.results[0].picture.large)
        //   }
        // });


        do {
            rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
            rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
            area = {x: rand_x, y: rand_y, width: size, height: size};
            if(tries==50){
              tries = 1;
              size = size/size_cut;
              //// console.log("Resized")
              //// console.log("Init",size)
            }
        } while(selfx.check_overlap(area) && (++tries<=50));
        $(this).height(size)
        $(this).width(size)
        selfx.filled_areas.push(area);
        selfx.filled_el.push($(this));
        
        $(this).css({left:rand_x, top: rand_y});
    });

    selfx.ready = true;
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
    this.EventsListSubscription.unsubscribe();
    clearInterval(this.timer)
  }
}
