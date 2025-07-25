import Dexie, { Table } from 'dexie';
import { Project, Task, Goal, Reminder, Settings, AnalyticsData } from '@shared/schema';

export class ProductivityDatabase extends Dexie {
  projects!: Table<Project>;
  tasks!: Table<Task>;
  goals!: Table<Goal>;
  reminders!: Table<Reminder>;
  settings!: Table<Settings>;
  analytics!: Table<AnalyticsData>;

  constructor() {
    super('ProductivityPWA');
    
    this.version(1).stores({
      projects: 'id, name, isArchived, createdAt',
      tasks: 'id, projectId, parentTaskId, priority, status, dueDate, completedAt, createdAt, order',
      goals: 'id, category, targetDate, isCompleted, completedAt, createdAt',
      reminders: 'id, scheduledAt, isCompleted, completedAt, linkedTaskId, linkedGoalId, createdAt',
      settings: 'theme, language',
      analytics: 'date, tasksCompleted, productivityScore'
    });

    this.projects.hook('creating', function (primKey, obj, trans) {
      obj.id = generateId();
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });

    this.projects.hook('updating', function (modifications) {
      modifications.updatedAt = new Date().toISOString();
    });

    this.tasks.hook('creating', function (primKey, obj, trans) {
      obj.id = generateId();
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });

    this.tasks.hook('updating', function (modifications) {
      modifications.updatedAt = new Date().toISOString();
    });

    this.goals.hook('creating', function (primKey, obj, trans) {
      obj.id = generateId();
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });

    this.goals.hook('updating', function (modifications) {
      modifications.updatedAt = new Date().toISOString();
    });

    this.reminders.hook('creating', function (primKey, obj, trans) {
      obj.id = generateId();
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });

    this.reminders.hook('updating', function (modifications) {
      modifications.updatedAt = new Date().toISOString();
    });
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const db = new ProductivityDatabase();

// Initialize default data
export async function initializeDefaultData() {
  try {
    const projectCount = await db.projects.count();
    if (projectCount === 0) {
      // Create default projects
      await db.projects.bulkAdd([
        {
          id: generateId(),
          name: 'Inbox',
          description: 'Quick capture for all new tasks',
          color: '#6B7280',
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: 'Personal',
          description: 'Personal tasks and goals',
          color: '#10B981',
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }

    // Initialize default settings if they don't exist
    const settings = await db.settings.toArray();
    if (settings.length === 0) {
      await db.settings.add({
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
      });
    }
  } catch (error) {
    console.error('Failed to initialize default data:', error);
  }
}

// Backup and restore functions
export async function exportData() {
  try {
    const [projects, tasks, goals, reminders, settings] = await Promise.all([
      db.projects.toArray(),
      db.tasks.toArray(),
      db.goals.toArray(),
      db.reminders.toArray(),
      db.settings.toArray()
    ]);

    return {
      version: 1,
      exportDate: new Date().toISOString(),
      data: {
        projects,
        tasks,
        goals,
        reminders,
        settings: settings[0]
      }
    };
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
}

export async function importData(data: any) {
  try {
    await db.transaction('rw', [db.projects, db.tasks, db.goals, db.reminders, db.settings], async () => {
      // Clear existing data
      await Promise.all([
        db.projects.clear(),
        db.tasks.clear(),
        db.goals.clear(),
        db.reminders.clear(),
        db.settings.clear()
      ]);

      // Import new data
      if (data.data.projects?.length) await db.projects.bulkAdd(data.data.projects);
      if (data.data.tasks?.length) await db.tasks.bulkAdd(data.data.tasks);
      if (data.data.goals?.length) await db.goals.bulkAdd(data.data.goals);
      if (data.data.reminders?.length) await db.reminders.bulkAdd(data.data.reminders);
      if (data.data.settings) await db.settings.add(data.data.settings);
    });
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
}
