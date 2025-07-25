import { StateCreator } from 'zustand';
import { Goal, InsertGoal, GoalCategory } from '@shared/schema';
import { db } from '../lib/db';

export interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  
  // Actions
  loadGoals: () => Promise<void>;
  createGoal: (goal: InsertGoal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleGoalComplete: (id: string) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  addMilestone: (goalId: string, milestone: { title: string }) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  addHabit: (goalId: string, habit: { title: string; frequency: { type: 'daily' | 'weekly'; target: number } }) => Promise<void>;
  completeHabit: (goalId: string, habitId: string, date: string) => Promise<void>;
  
  // Computed getters
  getGoalsByCategory: (category: GoalCategory) => Goal[];
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getGoalStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    averageProgress: number;
  };
}

export const goalStore: StateCreator<GoalState> = (set, get) => ({
  goals: [],
  isLoading: false,

  loadGoals: async () => {
    set({ isLoading: true });
    try {
      const goals = await db.goals.orderBy('createdAt').toArray();
      set({ goals, isLoading: false });
    } catch (error) {
      console.error('Failed to load goals:', error);
      set({ isLoading: false });
    }
  },

  createGoal: async (goalData: InsertGoal) => {
    try {
      await db.goals.add(goalData as Goal);
      await get().loadGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  },

  updateGoal: async (id: string, updates: Partial<Goal>) => {
    try {
      await db.goals.update(id, updates);
      await get().loadGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  },

  deleteGoal: async (id: string) => {
    try {
      await db.goals.delete(id);
      await get().loadGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  },

  toggleGoalComplete: async (id: string) => {
    try {
      const goal = get().goals.find(g => g.id === id);
      if (!goal) return;

      const updates: Partial<Goal> = {
        isCompleted: !goal.isCompleted,
        completedAt: goal.isCompleted ? undefined : new Date().toISOString(),
        progress: goal.isCompleted ? goal.progress : 100
      };

      await get().updateGoal(id, updates);
    } catch (error) {
      console.error('Failed to toggle goal completion:', error);
      throw error;
    }
  },

  updateGoalProgress: async (id: string, progress: number) => {
    try {
      const updates: Partial<Goal> = {
        progress: Math.max(0, Math.min(100, progress)),
        isCompleted: progress >= 100,
        completedAt: progress >= 100 ? new Date().toISOString() : undefined
      };

      await get().updateGoal(id, updates);
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      throw error;
    }
  },

  addMilestone: async (goalId: string, milestone: { title: string }) => {
    try {
      const goal = get().goals.find(g => g.id === goalId);
      if (!goal) return;

      const newMilestone = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: milestone.title,
        isCompleted: false
      };

      const updatedMilestones = [...goal.milestones, newMilestone];
      await get().updateGoal(goalId, { milestones: updatedMilestones });
    } catch (error) {
      console.error('Failed to add milestone:', error);
      throw error;
    }
  },

  toggleMilestone: async (goalId: string, milestoneId: string) => {
    try {
      const goal = get().goals.find(g => g.id === goalId);
      if (!goal) return;

      const updatedMilestones = goal.milestones.map(m =>
        m.id === milestoneId
          ? {
              ...m,
              isCompleted: !m.isCompleted,
              completedAt: m.isCompleted ? undefined : new Date().toISOString()
            }
          : m
      );

      // Calculate progress based on completed milestones
      const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
      const progress = updatedMilestones.length > 0 ? (completedCount / updatedMilestones.length) * 100 : 0;

      await get().updateGoal(goalId, { 
        milestones: updatedMilestones,
        progress
      });
    } catch (error) {
      console.error('Failed to toggle milestone:', error);
      throw error;
    }
  },

  addHabit: async (goalId: string, habit: { title: string; frequency: { type: 'daily' | 'weekly'; target: number } }) => {
    try {
      const goal = get().goals.find(g => g.id === goalId);
      if (!goal) return;

      const newHabit = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: habit.title,
        frequency: habit.frequency,
        currentStreak: 0,
        longestStreak: 0,
        completions: []
      };

      const updatedHabits = [...goal.habits, newHabit];
      await get().updateGoal(goalId, { habits: updatedHabits });
    } catch (error) {
      console.error('Failed to add habit:', error);
      throw error;
    }
  },

  completeHabit: async (goalId: string, habitId: string, date: string) => {
    try {
      const goal = get().goals.find(g => g.id === goalId);
      if (!goal) return;

      const updatedHabits = goal.habits.map(h => {
        if (h.id !== habitId) return h;

        const completions = [...h.completions];
        const dateIndex = completions.indexOf(date);
        
        if (dateIndex > -1) {
          // Remove completion
          completions.splice(dateIndex, 1);
        } else {
          // Add completion
          completions.push(date);
          completions.sort();
        }

        // Calculate streaks
        const sortedDates = completions.sort();
        let currentStreak = 0;
        let longestStreak = 0;
        let streak = 0;

        for (let i = 0; i < sortedDates.length; i++) {
          const current = new Date(sortedDates[i]);
          const previous = i > 0 ? new Date(sortedDates[i - 1]) : null;
          
          if (!previous || (current.getTime() - previous.getTime()) === 24 * 60 * 60 * 1000) {
            streak++;
          } else {
            streak = 1;
          }
          
          longestStreak = Math.max(longestStreak, streak);
          
          // Current streak is from the end
          if (i === sortedDates.length - 1) {
            const today = new Date().toISOString().split('T')[0];
            if (sortedDates[i] === today || 
                (new Date(today).getTime() - current.getTime()) === 24 * 60 * 60 * 1000) {
              currentStreak = streak;
            }
          }
        }

        return {
          ...h,
          completions,
          currentStreak,
          longestStreak
        };
      });

      await get().updateGoal(goalId, { habits: updatedHabits });
    } catch (error) {
      console.error('Failed to complete habit:', error);
      throw error;
    }
  },

  // Computed getters
  getGoalsByCategory: (category: GoalCategory) => {
    return get().goals.filter(goal => goal.category === category);
  },

  getActiveGoals: () => {
    return get().goals.filter(goal => !goal.isCompleted);
  },

  getCompletedGoals: () => {
    return get().goals.filter(goal => goal.isCompleted);
  },

  getGoalStats: () => {
    const goals = get().goals;
    const completed = goals.filter(g => g.isCompleted);
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    
    return {
      total: goals.length,
      completed: completed.length,
      inProgress: goals.length - completed.length,
      averageProgress: goals.length > 0 ? totalProgress / goals.length : 0
    };
  }
});
