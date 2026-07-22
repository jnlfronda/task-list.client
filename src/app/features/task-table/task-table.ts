import { Component, inject, Input } from '@angular/core';
import { Task } from '../../models/task-model';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-table',
  imports: [CommonModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
})
export class TaskTable {
  @Input() tasks!: Task[];
  private taskService = inject(TaskService);

  edit(task: Task): void {
    this.taskService.editingTask.set(task);
  }

  delete(id: number): void {
    this.taskService.deleteTask(id);
  }
}
