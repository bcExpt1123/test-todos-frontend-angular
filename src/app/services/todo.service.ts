import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from 'src/environments/environment';
import {map, take} from "rxjs";
import {Todo} from "../models/todo";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) {
  }

  getTodos(params?: { page?: number, size?: number, description?: string, priority?: number }) {
    return this.http.get<{ content: Todo[], totalElements: number }>(BACKEND_URL + '/todos', {params})
      .pipe(
        take(1),
      );
  }

  createTodo(todo: Todo) {
    return this.http.post<Todo>(BACKEND_URL + '/todos', todo);
  }

  updateTodo(todo: Todo) {
    return this.http.patch(BACKEND_URL + `/todos/${todo.id}`, todo);
  }

  deleteTodo(id: string) {
    return this.http.delete(BACKEND_URL + `/todos/${id}`);
  }
}
