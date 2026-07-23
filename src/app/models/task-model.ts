export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  category?: string;
  status: Status;
}

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type Priority = typeof PRIORITIES[number];

export const STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export type Status = typeof STATUSES[number];
