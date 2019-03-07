import { Component, OnInit, AfterViewInit } from '@angular/core';


@Component({
  selector: 'home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements AfterViewInit { 

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
        window['particle']("particles-js", {
          "particles": {
            "number": {
              "value": 355,
              "density": {
                "enable": true,
                "value_area": 789.1476416322727
              }
            },
            "color": {
              "value": "#FFB20F"
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              },
              "polygon": {
                "nb_sides": 2
              },
              "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
              }
            },
            "opacity": {
              "value": 0.48927153781200905,
              "random": false,
              "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0,
                "sync": false
              }
            },
            "line_linked": {
              "enable": false,
              "distance": 150,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 5,
              "direction": "none",
              "random": true,
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
                "enable": true,
                "mode": "bubble"
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
                "distance": 83.91608391608392,
                "size": 1,
                "duration": 3,
                "opacity": 1,
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
    var mySwiper = new Swiper('.swiper-container', {
      // Optional parameters
      // If we need pagination
      slidesPerView: 3,
      // centeredSlides: true,
      spaceBetween: 10,
      speed: 650,
      direction: 'horizontal',
      
      
    })
  }
}
