import { StateCreator } from 'zustand';
import { Project, InsertProject } from '@shared/schema';
import { db } from '../lib/db';

export interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  
  // Actions
  loadProjects: () => Promise<void>;
  createProject: (project: InsertProject) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  
  // Computed getters
  getActiveProjects: () => Project[];
  getArchivedProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  getInboxProject: () => Project | undefined;
}

export const projectStore: StateCreator<ProjectState> = (set, get) => ({
  projects: [],
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await db.projects.orderBy('createdAt').toArray();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to load projects:', error);
      set({ isLoading: false });
    }
  },

  createProject: async (projectData: InsertProject) => {
    try {
      await db.projects.add(projectData as Project);
      await get().loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      await db.projects.update(id, updates);
      await get().loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      // Move tasks to inbox before deleting project
      const inboxProject = get().getInboxProject();
      if (inboxProject) {
        await db.tasks.where('projectId').equals(id).modify({ projectId: inboxProject.id });
      }
      
      await db.projects.delete(id);
      await get().loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },

  archiveProject: async (id: string) => {
    try {
      await get().updateProject(id, { isArchived: true });
    } catch (error) {
      console.error('Failed to archive project:', error);
      throw error;
    }
  },

  // Computed getters
  getActiveProjects: () => {
    return get().projects.filter(project => !project.isArchived);
  },

  getArchivedProjects: () => {
    return get().projects.filter(project => project.isArchived);
  },

  getProjectById: (id: string) => {
    return get().projects.find(project => project.id === id);
  },

  getInboxProject: () => {
    return get().projects.find(project => project.name === 'Inbox');
  }
});
