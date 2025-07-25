import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  CalendarClock,
  AlertCircle,
  Plus,
  MoreHorizontal,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TasksSidebar() {
  const { t } = useTranslation();
  const {
    projects,
    currentView,
    setCurrentView,
    setCurrentProject,
    getTodayTasks,
    getUpcomingTasks,
    getOverdueTasks,
    getTasksByProject
  } = useStore();

  const activeProjects = projects.filter(p => !p.isArchived);
  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  const addProject = () => {
    // TODO: Implement add project modal
    console.log('Add project');
  };

  const selectProject = (projectId: string) => {
    setCurrentProject(projectId);
  };

  const projectMenu = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    // TODO: Implement project context menu
    console.log('Project menu for:', projectId);
  };

  const manageTags = () => {
    // TODO: Implement tag management modal
    console.log('Manage tags');
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Projects Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('projects.title', 'Projects')}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={addProject}
            className="h-7 w-7"
            title={t('projects.add', 'Add project')}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Smart Views */}
        <div className="space-y-1">
          <button
            onClick={() => setCurrentView('today')}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              currentView === 'today'
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <CalendarDays className="w-4 h-4 mr-3" />
            <span className="flex-1">{t('views.today', 'Today')}</span>
            <Badge variant="secondary" className="text-xs">
              {todayTasks.length}
            </Badge>
          </button>
          
          <button
            onClick={() => setCurrentView('upcoming')}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              currentView === 'upcoming'
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <CalendarClock className="w-4 h-4 mr-3" />
            <span className="flex-1">{t('views.upcoming', 'Upcoming')}</span>
            <Badge variant="secondary" className="text-xs">
              {upcomingTasks.length}
            </Badge>
          </button>
          
          <button
            onClick={() => setCurrentView('overdue')}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              currentView === 'overdue'
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <AlertCircle className="w-4 h-4 mr-3 text-red-400" />
            <span className="flex-1">{t('views.overdue', 'Overdue')}</span>
            <Badge variant="destructive" className="text-xs">
              {overdueTasks.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 p-4 custom-scrollbar overflow-y-auto">
        <div className="space-y-2">
          {activeProjects.map((project) => {
            const taskCount = getTasksByProject(project.id).length;
            const isSelected = currentView === 'project' && project.id === useStore.getState().currentProjectId;
            
            return (
              <div
                key={project.id}
                onClick={() => selectProject(project.id)}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200",
                  isSelected
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: project.color }}
                />
                <span className="flex-1 text-gray-900 dark:text-white font-medium">
                  {project.name}
                </span>
                <span className="text-xs text-gray-500 mr-2">
                  {taskCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => projectMenu(e, project.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t('projects.menu', 'Project menu')}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Tags Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('tags.title', 'Tags')}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={manageTags}
              className="h-6 w-6"
              title={t('tags.manage', 'Manage tags')}
            >
              <Tag className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">urgent</Badge>
            <Badge variant="secondary" className="text-xs">work</Badge>
            <Badge variant="secondary" className="text-xs">learning</Badge>
            <Badge variant="secondary" className="text-xs">personal</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
}
