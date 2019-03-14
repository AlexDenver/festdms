import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoAddComponent } from './todo-add/todo-add.component';
import { HomeComponent } from './home/home.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { EventComponent } from './event/event.component';

import { } from '@types/meteor-roles';

import { ReactiveFormsModule } from '@angular/forms';
import { EventpubComponent } from './eventpub/eventpub.component';
import  {Roles}  from 'meteor/alanning:roles'
import { MyFestService } from './myfest.services';
import { RoleGuard } from './roleguard.services';



const DEF_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  
};


let routes = [
  {
    path: 'todoList',
    component: TodoListComponent
  },
  {
    path: 'todoAdd',
    component: TodoAddComponent
  },
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
    canActivate: [RoleGuard],
    data: { roles: ['all'] }
  },{
    path: 'manage/event',
    component: EventComponent,
    canActivate: [RoleGuard],
    data: { roles: ['manage-event', 'all'] }
  },{
    path: 'event/:id',
    component: EventpubComponent
  }
  ,
  // 404 Page
  {
    path: '**',
    component: PageNotFoundComponent
  }
]



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
    TodoAddComponent,
    TodoListComponent,
    PageNotFoundComponent,
    AuthComponent,
    HomeComponent,
    DashboardComponent,
    EventComponent,
    EventpubComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


