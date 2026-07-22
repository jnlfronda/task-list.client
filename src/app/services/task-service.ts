import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../models/task-model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = '/api/tasks';
  readonly tasks = signal<Task[]>([]);
  readonly editingTask = signal<Task | null>(null);

  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe((task) => {
      this.tasks.set(task);
    });
  }

  addTask(task: Task): void {
    this.http.post<Task>(this.apiUrl, task).subscribe((created) => {
      this.tasks.update((current) => [...current, created]);
    });
  }

  editTask(task: Task): void {
    this.http.put<void>(`${this.apiUrl}/${task.id}`, task).subscribe(() => {
      this.tasks.update((current) => current.map((t) => (t.id === task.id ? task : t)));
    });
  }

  deleteTask(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.tasks.update((current) => current.filter((t) => t.id !== id));
    });
  }
}
