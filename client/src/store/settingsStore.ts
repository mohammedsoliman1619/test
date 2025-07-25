import { StateCreator } from 'zustand';
import { Settings } from '@shared/schema';
import { db } from '../lib/db';

export interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  
  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  exportData: () => Promise<void>;
  importData: (file: File) => Promise<void>;
  clearAllData: () => Promise<void>;
  updateAnalytics: () => Promise<void>;
}

export const settingsStore: StateCreator<SettingsState> = (set, get) => ({
  settings: null,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await db.settings.toArray();
      set({ settings: settings[0] || null, isLoading: false });
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoading: false });
    }
  },

  updateSettings: async (updates: Partial<Settings>) => {
    try {
      const currentSettings = get().settings;
      if (currentSettings) {
        const newSettings = { ...currentSettings, ...updates };
        await db.settings.put(newSettings);
        set({ settings: newSettings });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },

  exportData: async () => {
    try {
      const { exportData } = await import('../lib/db');
      const data = await exportData();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },

  importData: async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const { importData } = await import('../lib/db');
      await importData(data);
      
      // Reload all data
      window.location.reload();
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  },

  clearAllData: async () => {
    try {
      await Promise.all([
        db.projects.clear(),
        db.tasks.clear(),
        db.goals.clear(),
        db.reminders.clear(),
        db.analytics.clear()
      ]);
      
      // Reinitialize default data
      const { initializeDefaultData } = await import('../lib/db');
      await initializeDefaultData();
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  },

  updateAnalytics: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const state = get() as any; // Type assertion for access to other stores
      
      // Calculate analytics data
      const tasks = state.tasks || [];
      const goals = state.goals || [];
      
      const todayTasks = tasks.filter((t: any) => 
        t.completedAt?.startsWith(today)
      );
      
      const tasksCompleted = todayTasks.length;
      const tasksCreated = tasks.filter((t: any) => 
        t.createdAt?.startsWith(today)
      ).length;
      
      // Calculate productivity score
      const completionRate = tasks.length > 0 ? (tasksCompleted / tasks.length) * 100 : 0;
      const goalProgress = goals.length > 0 ? 
        goals.reduce((sum: number, goal: any) => sum + goal.progress, 0) / goals.length : 0;
      
      const productivityScore = Math.round((completionRate + goalProgress) / 2);
      
      // Get top tags
      const tagCount: Record<string, number> = {};
      todayTasks.forEach((task: any) => {
        task.tags?.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });
      
      const topTags = Object.entries(tagCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));
      
      const analyticsData = {
        date: today,
        tasksCompleted,
        tasksCreated,
        timeSpent: 0, // TODO: Implement time tracking
        productivityScore,
        goalsProgress: goalProgress,
        topTags
      };
      
      // Upsert analytics data
      await db.analytics.put(analyticsData);
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }
});
