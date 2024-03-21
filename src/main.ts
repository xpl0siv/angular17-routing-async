import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { TodoDetailComponent, TodoListComponent } from './todos.service';
import { provideHttpClient } from '@angular/common/http';
import {
  RouterModule,
  Routes,
  provideRouter,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import {} from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Example!</h1>
    <app-todo-list></app-todo-list>
    <router-outlet></router-outlet>
  `,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    TodoListComponent,
  ],
})
export class App {
  name = 'Angular';
}

const appRoutes: Routes = [
  { path: 'todo/:id', component: TodoDetailComponent },
];

bootstrapApplication(App, {
  providers: [provideRouter(appRoutes), provideHttpClient()],
});
