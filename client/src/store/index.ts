import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { taskStore } from './taskStore';
import { projectStore } from './projectStore';
import { goalStore } from './goalStore';
import { reminderStore } from './reminderStore';
import { settingsStore } from './settingsStore';

// Combine all stores
export const useStore = create(
  subscribeWithSelector(
    (...a) => ({
      ...taskStore(...a),
      ...projectStore(...a),
      ...goalStore(...a),
      ...reminderStore(...a),
      ...settingsStore(...a)
    })
  )
);

// Cross-store subscriptions for real-time updates
useStore.subscribe(
  (state) => state.tasks,
  (tasks) => {
    // Update analytics when tasks change
    useStore.getState().updateAnalytics();
  }
);

useStore.subscribe(
  (state) => state.goals,
  (goals) => {
    // Update analytics when goals change
    useStore.getState().updateAnalytics();
  }
);

export type AppState = ReturnType<typeof useStore.getState>;
