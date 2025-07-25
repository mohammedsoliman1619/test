import { 
  type Project, 
  type Task, 
  type Goal, 
  type Reminder, 
  type Settings,
  type AnalyticsData,
  type InsertProject,
  type InsertTask,
  type InsertGoal,
  type InsertReminder
} from "@shared/schema";

// Storage interface for the productivity platform
export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // Goals
  getGoals(): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;

  // Reminders
  getReminders(): Promise<Reminder[]>;
  getReminder(id: string): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: string, reminder: Partial<Reminder>): Promise<Reminder>;
  deleteReminder(id: string): Promise<void>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<Settings>): Promise<Settings>;

  // Analytics
  getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData[]>;
  saveAnalytics(analytics: AnalyticsData): Promise<void>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task> = new Map();
  private goals: Map<string, Goal> = new Map();
  private reminders: Map<string, Reminder> = new Map();
  private settings: Settings;
  private analytics: Map<string, AnalyticsData> = new Map();

  constructor() {
    // Initialize default settings
    this.settings = {
      theme: 'system',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      defaultStartPage: 'tasks',
      enableNotifications: true,
      enableSounds: true,
      workingHours: {
        start: '09:00',
        end: '17:00',
        workDays: [1, 2, 3, 4, 5]
      },
      accessibility: {
        reducedMotion: false,
        fontSize: 'medium',
        highContrast: false
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'weekly'
      },
      pinLock: {
        enabled: false
      }
    };
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      ...insertProject,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error('Project not found');
    
    const updated: Project = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
    // Also delete related tasks
    const taskEntries = Array.from(this.tasks.entries());
    for (const [taskId, task] of taskEntries) {
      if (task.projectId === id) {
        this.tasks.delete(taskId);
      }
    }
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      ...insertTask,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error('Task not found');
    
    const updated: Task = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks.delete(id);
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const now = new Date().toISOString();
    const goal: Goal = {
      ...insertGoal,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    this.goals.set(goal.id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const existing = this.goals.get(id);
    if (!existing) throw new Error('Goal not found');
    
    const updated: Goal = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals.delete(id);
  }

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values());
  }

  async getReminder(id: string): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const now = new Date().toISOString();
    const reminder: Reminder = {
      ...insertReminder,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    this.reminders.set(reminder.id, reminder);
    return reminder;
  }

  async updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder> {
    const existing = this.reminders.get(id);
    if (!existing) throw new Error('Reminder not found');
    
    const updated: Reminder = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.reminders.set(id, updated);
    return updated;
  }

  async deleteReminder(id: string): Promise<void> {
    this.reminders.delete(id);
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // Analytics
  async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData[]> {
    let data = Array.from(this.analytics.values());
    
    if (startDate) {
      data = data.filter(item => item.date >= startDate);
    }
    
    if (endDate) {
      data = data.filter(item => item.date <= endDate);
    }
    
    return data.sort((a, b) => a.date.localeCompare(b.date));
  }

  async saveAnalytics(analytics: AnalyticsData): Promise<void> {
    this.analytics.set(analytics.date, analytics);
  }
}

export const storage = new MemStorage();
