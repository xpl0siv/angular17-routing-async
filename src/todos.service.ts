import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Observable, switchMap } from 'rxjs';

// Interface to manage object
export interface Todo {
  userId: number;
  id: number;
  title: string;
  complete: boolean;
}

// Service to handle data
@Injectable()
export class TodosService {
  private BASE_URL: string = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient) {}
  getTodos() {
    return this.http.get(`${this.BASE_URL}`);
  }
  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.BASE_URL}/${id}`);
  }
}

//Full list of todo items
@Component({
  standalone: true,
  selector: 'app-todo-list',
  template: `
  <ul>
    @for(todo of todos; track todo.id){
      <li>
        <a [routerLink]="['todo',todo.id]" routerLinkActive="active">
          {{todo.title}}
        </a>
     </li>
    } @empty {
      <li>No items.</li>
    }
  </ul>
  `,
  providers: [TodosService],
  imports: [RouterLink, RouterLinkActive],
})
export class TodoListComponent implements OnInit {
  private _todos: Todo[] = [];
  private todoService: TodosService = inject(TodosService);
  ngOnInit() {
    this.todoService.getTodos().subscribe({
      next: (response: any) => {
        this.todos = response.slice(0, 4);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  get todos() {
    return this._todos;
  }
  set todos(todos: Todo[]) {
    this._todos = todos;
  }
}

/**
 * Detail of todo item passed by route param.
 * @see https://angular.dev/guide/routing/common-router-tasks#accessing-query-parameters-and-fragments
 */
@Component({
  standalone: true,
  selector: 'app-todo-detail',
  template: `
    <a [routerLink]="['/']">Back</a>
    <h2>Todo detail</h2>
    @if( todo$ | async; as todoItem) {
      {{todoItem.id}}
      {{todoItem.title}}
      {{todoItem.complete}}
    }
  `,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    AsyncPipe,
  ],
  providers: [TodosService],
})
export class TodoDetailComponent {
  todo$!: Observable<Todo>;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodosService
  ) {}

  ngOnInit() {
    this.todo$ = this.route.paramMap.pipe(
      switchMap((params) => {
        let todoId = params.get('id');
        return this.todoService.getTodoById('' + todoId);
      })
    );
  }
}
