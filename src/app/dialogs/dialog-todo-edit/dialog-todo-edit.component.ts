import {Component, Inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Todo} from "../../models/todo";
import {TodoService} from "../../services/todo.service";

@Component({
  selector: 'app-dialog-todo-edit',
  templateUrl: './dialog-todo-edit.component.html',
  styleUrls: ['./dialog-todo-edit.component.scss']
})
export class DialogTodoEditComponent {

  isCreating = !this.data.todo;
  isSaving = false;

  title = this.isCreating ? 'Todo Create' : 'Todo Edit';
  action = this.isCreating ? 'Create' : 'Save';

  todoForm = this.fb.group({
    description: [this.data.todo?.description ?? '', Validators.required],
    dueDate: [this.data.todo?.dueDate ? new Date(this.data.todo?.dueDate) : new Date()],
    priority: [this.data.todo?.priority ?? 0]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo },
    private dialogRef: MatDialogRef<DialogTodoEditComponent>,
    private todoService: TodoService,
    private fb: FormBuilder
  ) {
  }

  onSubmit() {
    if (this.todoForm.invalid) {
      return;
    }

    if (this.data.todo && this.data.todo.id) {
      const todo = {
        id: this.data.todo.id,
        ...this.todoForm.value,
        dueDate: this.todoForm.value.dueDate ? this.todoForm.value.dueDate.getTime() : undefined,
      };

      this.isSaving = true;
      this.todoService.updateTodo(todo as Todo)
        .subscribe(() => {
          this.isSaving = false;
          this.dialogRef.close(true);
        });
    } else {
      this.isSaving = true;

      const todo = {
        ...this.todoForm.value,
        dueDate: this.todoForm.value.dueDate ? this.todoForm.value.dueDate.getTime() : undefined,
      };

      this.todoService.createTodo(todo as Todo)
        .subscribe(() => {
          this.isSaving = false;
          this.dialogRef.close(true);
        });
    }
  }
}
