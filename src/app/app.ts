import { Component } from '@angular/core';
import { TaskForm } from './features/task-form/task-form';
import { TaskList } from './features/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [TaskForm, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}
