export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}
