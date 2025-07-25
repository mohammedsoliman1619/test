import { Task, TaskPriority, TaskStatus } from '@shared/schema';
import { parseNaturalLanguageDate } from './dateUtils';

export function parseTaskTitle(title: string): {
  cleanTitle: string;
  priority?: TaskPriority;
  tags: string[];
  dueDate?: string;
} {
  let cleanTitle = title.trim();
  let priority: TaskPriority | undefined;
  const tags: string[] = [];
  let dueDate: string | undefined;

  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = cleanTitle.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    priority = priorityMatch[1].toUpperCase() as TaskPriority;
    cleanTitle = cleanTitle.replace(priorityMatch[0], '').trim();
  }

  // Extract tags (#tag)
  const tagMatches = cleanTitle.match(/#\w+/g);
  if (tagMatches) {
    tagMatches.forEach(tag => {
      tags.push(tag.substring(1)); // Remove the #
      cleanTitle = cleanTitle.replace(tag, '').trim();
    });
  }

  // Extract due date (@date)
  const dueDateMatch = cleanTitle.match(/@([^@]+?)(?:\s|$)/);
  if (dueDateMatch) {
    const dateStr = dueDateMatch[1].trim();
    const parsedDate = parseNaturalLanguageDate(dateStr);
    if (parsedDate) {
      dueDate = parsedDate.toISOString();
    }
    cleanTitle = cleanTitle.replace(dueDateMatch[0], '').trim();
  }

  return {
    cleanTitle,
    priority,
    tags,
    dueDate
  };
}

export function getTaskCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getTasksByPriority(tasks: Task[]): Record<TaskPriority, Task[]> {
  return {
    [TaskPriority.P1]: tasks.filter(t => t.priority === TaskPriority.P1),
    [TaskPriority.P2]: tasks.filter(t => t.priority === TaskPriority.P2),
    [TaskPriority.P3]: tasks.filter(t => t.priority === TaskPriority.P3),
    [TaskPriority.P4]: tasks.filter(t => t.priority === TaskPriority.P4)
  };
}

export function getTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  return {
    [TaskStatus.TODO]: tasks.filter(t => t.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.COMPLETED]: tasks.filter(t => t.status === TaskStatus.COMPLETED),
    [TaskStatus.CANCELLED]: tasks.filter(t => t.status === TaskStatus.CANCELLED)
  };
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = [TaskPriority.P1, TaskPriority.P2, TaskPriority.P3, TaskPriority.P4];
  return tasks.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.priority);
    const bIndex = priorityOrder.indexOf(b.priority);
    return aIndex - bIndex;
  });
}

export function sortTasksByDueDate(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function sortTasksByCreatedDate(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function filterTasksBySearch(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description?.toLowerCase().includes(lowercaseQuery) ||
    task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getTaskProgress(task: Task): number {
  if (task.status === TaskStatus.COMPLETED) return 100;
  if (task.status === TaskStatus.IN_PROGRESS) return 50;
  return 0;
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function estimateTaskDuration(task: Task): number {
  // Simple estimation based on title length and complexity
  const baseTime = 30; // 30 minutes base
  const titleLength = task.title.length;
  const hasDescription = task.description && task.description.length > 0;
  const tagCount = task.tags.length;
  
  let estimate = baseTime;
  
  // Add time based on title length
  estimate += Math.floor(titleLength / 10) * 5;
  
  // Add time if has description
  if (hasDescription) {
    estimate += 15;
  }
  
  // Add time based on tag complexity
  estimate += tagCount * 5;
  
  // Adjust based on priority
  switch (task.priority) {
    case TaskPriority.P1:
      estimate *= 1.5;
      break;
    case TaskPriority.P2:
      estimate *= 1.2;
      break;
    case TaskPriority.P3:
      estimate *= 1.0;
      break;
    case TaskPriority.P4:
      estimate *= 0.8;
      break;
  }
  
  return Math.round(estimate);
}

export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.P1:
      return 'bg-red-500';
    case TaskPriority.P2:
      return 'bg-orange-500';
    case TaskPriority.P3:
      return 'bg-yellow-500';
    case TaskPriority.P4:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-gray-500';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-500';
    case TaskStatus.COMPLETED:
      return 'bg-green-500';
    case TaskStatus.CANCELLED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
