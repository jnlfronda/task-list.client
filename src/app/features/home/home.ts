import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { TaskService } from '../../services/task-service';
import { TaskForm } from '../task-form/task-form';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-home',
  imports: [TaskForm, TaskList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private auth = inject(AuthService);
  private taskService = inject(TaskService);

  username = this.auth.username;

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  logout(): void {
    this.auth.logout();
  }
}