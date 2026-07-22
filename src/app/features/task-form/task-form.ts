import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PRIORITIES, Priority, Status, STATUSES, Task } from '../../models/task-model';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  editingId: number | null = null;
  readonly priorities = PRIORITIES;
  readonly status = STATUSES;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    dueDate: [''],
    priority: ['Medium', Validators.required],
    category: [''],
    status: ['Pending', Validators.required],
  });

  constructor() {
    effect(() => {
      const task = this.taskService.editingTask();
      if (task) {
        this.editingId = task.id;
        this.form.setValue({
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().substring(0, 10),
          priority: task.priority,
          category: task.category ?? '-',
          status: task.status,
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const task: Task = {
      id: this.editingId ?? 0,
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      dueDate: new Date(this.form.value.dueDate ?? ''),
      priority: (this.form.value.priority ?? 'Medium') as Priority,
      category: this.form.value.category ?? '',
      status: (this.form.value.status ?? 'Pending') as Status
    };

    if (this.editingId) {
      this.taskService.editTask(task);
    } else {
      this.taskService.addTask(task);
    }

    this.reset();
  }

  cancel(): void {
    this.reset();
  }

  private reset(): void {
    this.editingId = null;
    this.taskService.editingTask.set(null);
    this.form.reset({
      priority: 'Medium',
      status: 'Pending',
    });
  }
}
