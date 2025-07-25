import { StateCreator } from 'zustand';
import { Reminder, InsertReminder } from '@shared/schema';
import { db } from '../lib/db';

export interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  
  // Actions
  loadReminders: () => Promise<void>;
  createReminder: (reminder: InsertReminder) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;
  
  // Computed getters
  getUpcomingReminders: () => Reminder[];
  getOverdueReminders: () => Reminder[];
  getTodayReminders: () => Reminder[];
  getReminderStats: () => {
    total: number;
    completed: number;
    overdue: number;
    today: number;
  };
}

export const reminderStore: StateCreator<ReminderState> = (set, get) => ({
  reminders: [],
  isLoading: false,

  loadReminders: async () => {
    set({ isLoading: true });
    try {
      const reminders = await db.reminders.orderBy('scheduledAt').toArray();
      set({ reminders, isLoading: false });
    } catch (error) {
      console.error('Failed to load reminders:', error);
      set({ isLoading: false });
    }
  },

  createReminder: async (reminderData: InsertReminder) => {
    try {
      await db.reminders.add(reminderData as Reminder);
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to create reminder:', error);
      throw error;
    }
  },

  updateReminder: async (id: string, updates: Partial<Reminder>) => {
    try {
      await db.reminders.update(id, updates);
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
      throw error;
    }
  },

  deleteReminder: async (id: string) => {
    try {
      await db.reminders.delete(id);
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      throw error;
    }
  },

  completeReminder: async (id: string) => {
    try {
      const updates: Partial<Reminder> = {
        isCompleted: true,
        completedAt: new Date().toISOString()
      };

      await get().updateReminder(id, updates);
    } catch (error) {
      console.error('Failed to complete reminder:', error);
      throw error;
    }
  },

  snoozeReminder: async (id: string, minutes: number) => {
    try {
      const newTime = new Date();
      newTime.setMinutes(newTime.getMinutes() + minutes);
      
      const updates: Partial<Reminder> = {
        snoozeUntil: newTime.toISOString()
      };

      await get().updateReminder(id, updates);
    } catch (error) {
      console.error('Failed to snooze reminder:', error);
      throw error;
    }
  },

  // Computed getters
  getUpcomingReminders: () => {
    const now = new Date();
    return get().reminders.filter(reminder => 
      !reminder.isCompleted &&
      new Date(reminder.scheduledAt) > now &&
      (!reminder.snoozeUntil || new Date(reminder.snoozeUntil) <= now)
    );
  },

  getOverdueReminders: () => {
    const now = new Date();
    return get().reminders.filter(reminder => 
      !reminder.isCompleted &&
      new Date(reminder.scheduledAt) < now &&
      (!reminder.snoozeUntil || new Date(reminder.snoozeUntil) <= now)
    );
  },

  getTodayReminders: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().reminders.filter(reminder => 
      !reminder.isCompleted &&
      reminder.scheduledAt.startsWith(today)
    );
  },

  getReminderStats: () => {
    const reminders = get().reminders;
    const completed = reminders.filter(r => r.isCompleted);
    const overdue = get().getOverdueReminders();
    const today = get().getTodayReminders();

    return {
      total: reminders.length,
      completed: completed.length,
      overdue: overdue.length,
      today: today.length
    };
  }
});
