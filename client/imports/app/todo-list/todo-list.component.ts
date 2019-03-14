import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { EventsCollection } from '../../../../imports/collections/all';
import { MyFestEvent } from '../../../../imports/models/events';

@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html',
  styleUrls: ['todo-list.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Observable<MyFestEvent[]>;
  todoListSubscription: Subscription;
  ngOnInit() {
    this.todoListSubscription = MeteorObservable.subscribe('todoList').subscribe(() => {
      this.todos = EventsCollection.find();
    });
  }
  ngOnDestroy() {
    if (this.todoListSubscription) {
      this.todoListSubscription.unsubscribe();
    }
  }
  removeTodo(_id: string) {
    Meteor.call('removeTodo', _id);
  }
}
