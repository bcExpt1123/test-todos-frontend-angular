import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTodoEditComponent } from './dialog-todo-edit.component';

describe('DialogTodoEditComponent', () => {
  let component: DialogTodoEditComponent;
  let fixture: ComponentFixture<DialogTodoEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogTodoEditComponent]
    });
    fixture = TestBed.createComponent(DialogTodoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
