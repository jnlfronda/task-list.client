import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { TaskTable } from "../task-table/task-table";

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskTable],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;
}
