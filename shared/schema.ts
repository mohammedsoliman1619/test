import { z } from "zod";

// Enums
export const TaskPriority = {
  P1: 'P1',
  P2: 'P2', 
  P3: 'P3',
  P4: 'P4'
} as const;

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const GoalCategory = {
  HEALTH: 'health',
  CAREER: 'career',
  LEARNING: 'learning',
  PERSONAL: 'personal',
  FINANCE: 'finance',
  RELATIONSHIPS: 'relationships'
} as const;

export const RecurrenceType = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
} as const;

// Base schemas
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default('#3B82F6'),
  isArchived: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  parentTaskId: z.string().optional(),
  priority: z.enum([TaskPriority.P1, TaskPriority.P2, TaskPriority.P3, TaskPriority.P4]).default(TaskPriority.P4),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED]).default(TaskStatus.TODO),
  tags: z.array(z.string()).default([]),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  completedAt: z.string().optional(),
  recurrence: z.object({
    type: z.enum([RecurrenceType.NONE, RecurrenceType.DAILY, RecurrenceType.WEEKLY, RecurrenceType.MONTHLY, RecurrenceType.YEARLY, RecurrenceType.CUSTOM]),
    interval: z.number().default(1),
    daysOfWeek: z.array(z.number()).optional(),
    endDate: z.string().optional()
  }).default({ type: RecurrenceType.NONE, interval: 1 }),
  order: z.number().default(0),
  estimatedMinutes: z.number().optional(),
  actualMinutes: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum([GoalCategory.HEALTH, GoalCategory.CAREER, GoalCategory.LEARNING, GoalCategory.PERSONAL, GoalCategory.FINANCE, GoalCategory.RELATIONSHIPS]),
  targetDate: z.string().optional(),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().optional(),
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    isCompleted: z.boolean().default(false),
    completedAt: z.string().optional()
  })).default([]),
  habits: z.array(z.object({
    id: z.string(),
    title: z.string(),
    frequency: z.object({
      type: z.enum([RecurrenceType.DAILY, RecurrenceType.WEEKLY]),
      target: z.number()
    }),
    currentStreak: z.number().default(0),
    longestStreak: z.number().default(0),
    completions: z.array(z.string()).default([])
  })).default([]),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const reminderSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledAt: z.string(),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().optional(),
  recurrence: z.object({
    type: z.enum([RecurrenceType.NONE, RecurrenceType.DAILY, RecurrenceType.WEEKLY, RecurrenceType.MONTHLY, RecurrenceType.YEARLY]),
    interval: z.number().default(1),
    endDate: z.string().optional()
  }).default({ type: RecurrenceType.NONE, interval: 1 }),
  linkedTaskId: z.string().optional(),
  linkedGoalId: z.string().optional(),
  snoozeUntil: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['en', 'es', 'zh', 'ar', 'fr', 'hi', 'ru', 'pt', 'de', 'ja']).default('en'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  defaultStartPage: z.enum(['tasks', 'calendar', 'goals', 'reminders', 'analytics']).default('tasks'),
  enableNotifications: z.boolean().default(true),
  enableSounds: z.boolean().default(true),
  workingHours: z.object({
    start: z.string().default('09:00'),
    end: z.string().default('17:00'),
    workDays: z.array(z.number()).default([1, 2, 3, 4, 5])
  }),
  accessibility: z.object({
    reducedMotion: z.boolean().default(false),
    fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
    highContrast: z.boolean().default(false)
  }).default({}),
  backup: z.object({
    autoBackup: z.boolean().default(true),
    backupFrequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
    lastBackup: z.string().optional()
  }).default({ autoBackup: true, backupFrequency: 'weekly' }),
  pinLock: z.object({
    enabled: z.boolean().default(false),
    pin: z.string().optional()
  }).default({ enabled: false })
});

export const analyticsDataSchema = z.object({
  date: z.string(),
  tasksCompleted: z.number().default(0),
  tasksCreated: z.number().default(0),
  timeSpent: z.number().default(0),
  productivityScore: z.number().min(0).max(100).default(0),
  goalsProgress: z.number().min(0).max(100).default(0),
  topTags: z.array(z.object({
    tag: z.string(),
    count: z.number()
  })).default([])
});

// Insert schemas
export const insertProjectSchema = projectSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertTaskSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertGoalSchema = goalSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertReminderSchema = reminderSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Project = z.infer<typeof projectSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type Reminder = z.infer<typeof reminderSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
