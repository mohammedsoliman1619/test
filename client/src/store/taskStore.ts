import { StateCreator } from 'zustand';
import { Task, InsertTask, Project, TaskPriority, TaskStatus } from '@shared/schema';
import { db } from '../lib/db';

export interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  currentProjectId: string | null;
  currentView: 'today' | 'upcoming' | 'overdue' | 'project';
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  loadTasks: () => Promise<void>;
  createTask: (task: InsertTask) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  setSelectedTask: (id: string | null) => void;
  setCurrentProject: (id: string | null) => void;
  setCurrentView: (view: 'today' | 'upcoming' | 'overdue' | 'project') => void;
  setSearchQuery: (query: string) => void;
  reorderTasks: (projectId: string, taskIds: string[]) => Promise<void>;
  
  // Computed getters
  getTasksByProject: (projectId: string) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getSubtasks: (parentId: string) => Task[];
  getFilteredTasks: () => Task[];
  getTaskStats: () => {
    total: number;
    completed: number;
    overdue: number;
    today: number;
    upcoming: number;
  };
}

export const taskStore: StateCreator<TaskState> = (set, get) => ({
  tasks: [],
  selectedTaskId: null,
  currentProjectId: null,
  currentView: 'today',
  isLoading: false,
  searchQuery: '',

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await db.tasks.orderBy('order').toArray();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ isLoading: false });
    }
  },

  createTask: async (taskData: InsertTask) => {
    try {
      // Get the highest order for the project
      const projectTasks = get().getTasksByProject(taskData.projectId);
      const maxOrder = Math.max(...projectTasks.map(t => t.order), -1);
      
      const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        ...taskData,
        order: maxOrder + 1,
      };
      
      await db.tasks.add(task as Task);
      await get().loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      await db.tasks.update(id, updates);
      await get().loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      // Also delete subtasks
      const subtasks = get().getSubtasks(id);
      await db.tasks.bulkDelete([id, ...subtasks.map(t => t.id)]);
      await get().loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  toggleTaskComplete: async (id: string) => {
    try {
      const task = get().tasks.find(t => t.id === id);
      if (!task) return;

      const updates: Partial<Task> = {
        status: task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED,
        completedAt: task.status === TaskStatus.COMPLETED ? undefined : new Date().toISOString()
      };

      await get().updateTask(id, updates);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      throw error;
    }
  },

  setSelectedTask: (id: string | null) => {
    set({ selectedTaskId: id });
  },

  setCurrentProject: (id: string | null) => {
    set({ currentProjectId: id, currentView: 'project' });
  },

  setCurrentView: (view: 'today' | 'upcoming' | 'overdue' | 'project') => {
    set({ currentView: view });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  reorderTasks: async (projectId: string, taskIds: string[]) => {
    try {
      const updates = taskIds.map((id, index) => ({
        key: id,
        changes: { order: index }
      }));
      
      await db.tasks.bulkUpdate(updates);
      await get().loadTasks();
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      throw error;
    }
  },

  // Computed getters
  getTasksByProject: (projectId: string) => {
    return get().tasks.filter(task => task.projectId === projectId);
  },

  getTasksByPriority: (priority: TaskPriority) => {
    return get().tasks.filter(task => task.priority === priority);
  },

  getTodayTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter(task => 
      task.status !== TaskStatus.COMPLETED &&
      task.dueDate?.startsWith(today)
    );
  },

  getUpcomingTasks: () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return get().tasks.filter(task => 
      task.status !== TaskStatus.COMPLETED &&
      task.dueDate &&
      new Date(task.dueDate) > today &&
      new Date(task.dueDate) <= nextWeek
    );
  },

  getOverdueTasks: () => {
    const today = new Date();
    return get().tasks.filter(task => 
      task.status !== TaskStatus.COMPLETED &&
      task.dueDate &&
      new Date(task.dueDate) < today
    );
  },

  getSubtasks: (parentId: string) => {
    return get().tasks.filter(task => task.parentTaskId === parentId);
  },

  getFilteredTasks: () => {
    const { tasks, searchQuery, currentView, currentProjectId } = get();
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply view filter
    switch (currentView) {
      case 'today':
        filtered = get().getTodayTasks();
        break;
      case 'upcoming':
        filtered = get().getUpcomingTasks();
        break;
      case 'overdue':
        filtered = get().getOverdueTasks();
        break;
      case 'project':
        if (currentProjectId) {
          filtered = filtered.filter(task => task.projectId === currentProjectId);
        }
        break;
    }

    return filtered;
  },

  getTaskStats: () => {
    const tasks = get().tasks;
    const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED);
    const overdue = get().getOverdueTasks();
    const today = get().getTodayTasks();
    const upcoming = get().getUpcomingTasks();

    return {
      total: tasks.length,
      completed: completed.length,
      overdue: overdue.length,
      today: today.length,
      upcoming: upcoming.length
    };
  }
});
