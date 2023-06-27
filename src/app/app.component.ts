import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {TodoService} from './services/todo.service';
import {FormBuilder} from "@angular/forms";
import {debounceTime, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Todo} from "./models/todo";
import {MatDialog} from "@angular/material/dialog";
import {DialogTodoEditComponent} from "./dialogs/dialog-todo-edit/dialog-todo-edit.component";
import {DialogConfirmDeleteComponent} from "./dialogs/dialog-confirm-delete/dialog-confirm-delete.component";

interface Pagination {
  length: number;
  pageSize: number;
  pageIndex: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private formValueSub: Subscription = new Subscription();

  searchForm = this.fb.group({
    description: [''],
    priority: [-1],
  });

  displayedColumns: string[] = ['description', 'dueDate', 'priority', 'actions'];
  dataSource = new MatTableDataSource<Todo>();

  pagination: Pagination = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  }

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.formValueSub = this.searchForm
      .valueChanges
      .pipe(
        debounceTime(200)
      )
      .subscribe(() => {
        this.resetPage();
        this.getList();
      });

    this.getList();
  }

  ngOnDestroy(): void {
    this.formValueSub.unsubscribe();
  }

  private resetPage() {
    this.pagination.pageIndex = 0;
  }

  private getList() {
    const filterValue = {
      description: this.searchForm.value.description ?? '',
      priority: this.searchForm.value.priority ?? -1,
    };

    this.todoService.getTodos({
      page: this.pagination.pageIndex + 1,
      size: this.pagination.pageSize,
      ...filterValue,
    })
      .subscribe((result) => {
        this.pagination.length = result.totalElements;
        this.dataSource.data = result.content;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.length = e.length;
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageIndex = e.pageIndex;

    this.getList();
  }

  onEdit(todo?: Todo) {
    this.matDialog.open(DialogTodoEditComponent, {
      data: {
        todo: todo,
      }
    }).afterClosed().subscribe((result) => {
      if (result === true) {
        this.getList();
      }
    });
  }

  onDelete(todo: Todo) {
    this.matDialog.open(DialogConfirmDeleteComponent).afterClosed().subscribe((result) => {
      if (result === true) {
        this.todoService.deleteTodo(todo.id || '').subscribe(() => {
          this.getList();
        });
      }
    })
  }

}
