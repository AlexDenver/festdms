import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {RegisterComponent} from './register/register.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { EventComponent } from './event/event.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';


import {EventListComponent} from './event-list/eventlist.component'
import { ScoreSheetComponent } from './score-sheet/scoresheet.component';

import { ReactiveFormsModule } from '@angular/forms';
import { EventpubComponent, SafeHtmlPipe } from './eventpub/eventpub.component';
import  {Roles}  from 'meteor/alanning:roles'
import { MyFestService } from './myfest.services';
import { RoleGuard } from './roleguard.services';
import { AuthService }from './auth.service';
import { from } from 'rxjs';
import { ParticipantComponent } from './participant/participant.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TributeComponent } from './tribute/tribute.component';



const DEF_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  
};



let routes = [
  // Home Page
  {
    path: '',
    // redirectTo: '',
    component: HomeComponent,
    // pathMatch: 'full'
  },{
    path: 'auth',
    component: AuthComponent
  },{
    path: 'dashboard',
    component: DashboardComponent,
    data: { roles: ['all'] }
    
  },{
    path: 'manage/:state',
    component: EventComponent,
    // canActivate: [RoleGuard],
    data: { roles: ['manage-event', 'all'] }
  },{
    path: 'event/:id',
    component: EventpubComponent
  },{
    path: 'events',
    component: EventListComponent
  },{
    path: 'register',
    component: RegisterComponent
  },{
    path: 'teams',
    component: TeamComponent
  },{
    path: 'teams/:id',
    component: TeamComponent
  },{
    path: 'about',
    component: AboutComponent
  },{
    path: 'alerts',
    component: NotificationsComponent
  },
  {
    path: 'scores/:id',
    component: ScoreSheetComponent
  },{
    path: 'participant/:id',
    component: ParticipantComponent
  },
  // 404 Page
  {
    path: '**',
    component: PageNotFoundComponent
  }
  
]

if(Meteor.call('isTributeModeSet'))
  routes.unshift({
    path: '**',
    component: TributeComponent
  })



@NgModule({
  imports: [
    BrowserModule,
    SwiperModule,
    AccountsModule,
    FormsModule,  
    ReactiveFormsModule,      
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AuthComponent,
    HomeComponent,
    DashboardComponent,
    EventComponent,
    EventpubComponent,
    RegisterComponent,
    EventListComponent,
    TeamComponent,
    SafeHtmlPipe,
    AboutComponent,
    ScoreSheetComponent,
    ParticipantComponent,
    NotificationsComponent,
    TributeComponent
  ],
  bootstrap: [
    AppComponent
  ],
  // providers: [AuthService]
})
export class AppModule { }


