import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { TaskItem } from './TaskItem';
import { QuickAdd } from './QuickAdd';
import { TaskPriority, TaskStatus } from '@shared/schema';
import { cn } from '@/lib/utils';
import {
  List,
  Columns,
  Filter,
  ArrowUpDown,
  ChevronUp,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TasksList() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  
  const {
    getFilteredTasks,
    currentView,
    currentProjectId,
    getProjectById,
    isLoading
  } = useStore();

  const tasks = getFilteredTasks();
  const currentProject = currentProjectId ? getProjectById(currentProjectId) : null;

  // Group tasks by priority
  const tasksByPriority = {
    [TaskPriority.P1]: tasks.filter(t => t.priority === TaskPriority.P1 && t.status !== TaskStatus.COMPLETED),
    [TaskPriority.P2]: tasks.filter(t => t.priority === TaskPriority.P2 && t.status !== TaskStatus.COMPLETED),
    [TaskPriority.P3]: tasks.filter(t => t.priority === TaskPriority.P3 && t.status !== TaskStatus.COMPLETED),
    [TaskPriority.P4]: tasks.filter(t => t.priority === TaskPriority.P4 && t.status !== TaskStatus.COMPLETED),
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED)
  };

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  const toggleFilters = () => {
    // TODO: Implement filters panel
    console.log('Toggle filters');
  };

  const sortTasks = () => {
    // TODO: Implement sort options
    console.log('Sort tasks');
  };

  const addNewTask = () => {
    // TODO: Implement add task modal
    console.log('Add new task');
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'today':
        return t('views.today', 'Today');
      case 'upcoming':
        return t('views.upcoming', 'Upcoming');
      case 'overdue':
        return t('views.overdue', 'Overdue');
      case 'project':
        return currentProject?.name || t('projects.unknown', 'Unknown Project');
      default:
        return t('pages.tasks.title', 'Tasks');
    }
  };

  const getTasksCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.completedAt?.startsWith(today)).length;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">
          {t('common.loading', 'Loading...')}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Tasks Header */}
      <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('tasks.count', '{{count}} tasks', { count: tasks.length })}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-green-600 dark:text-green-400">
                {t('tasks.completed_today_count', '{{count}} completed today', { 
                  count: getTasksCompletedToday() 
                })}
              </span>
            </div>
          </div>
          
          {/* View Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'board' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('board')}
                className="h-8 px-3"
              >
                <Columns className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFilters}
              title={t('tasks.filters', 'Filters')}
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={sortTasks}
              title={t('tasks.sort', 'Sort')}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Add */}
        <QuickAdd />
      </div>

      {/* Tasks List */}
      <div className="flex-1 p-6 custom-scrollbar overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('tasks.empty.title', 'No tasks yet')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('tasks.empty.description', 'Create your first task to get started.')}
            </p>
            <Button onClick={addNewTask}>
              {t('actions.add_task', 'Add Task')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* High Priority Section */}
            {tasksByPriority[TaskPriority.P1].length > 0 && (
              <TaskSection
                title={t('priority.high', 'High Priority')}
                tasks={tasksByPriority[TaskPriority.P1]}
                color="red"
                isCollapsed={collapsedSections.has('high')}
                onToggle={() => toggleSection('high')}
              />
            )}

            {/* Normal Priority Section */}
            {tasksByPriority[TaskPriority.P2].length > 0 && (
              <TaskSection
                title={t('priority.normal', 'Normal Priority')}
                tasks={tasksByPriority[TaskPriority.P2]}
                color="blue"
                isCollapsed={collapsedSections.has('normal')}
                onToggle={() => toggleSection('normal')}
              />
            )}

            {/* Low Priority Section */}
            {(tasksByPriority[TaskPriority.P3].length > 0 || tasksByPriority[TaskPriority.P4].length > 0) && (
              <TaskSection
                title={t('priority.low', 'Low Priority')}
                tasks={[...tasksByPriority[TaskPriority.P3], ...tasksByPriority[TaskPriority.P4]]}
                color="gray"
                isCollapsed={collapsedSections.has('low')}
                onToggle={() => toggleSection('low')}
              />
            )}

            {/* Completed Section */}
            {tasksByPriority.completed.length > 0 && (
              <TaskSection
                title={t('tasks.completed', 'Completed')}
                tasks={tasksByPriority.completed}
                color="green"
                isCollapsed={collapsedSections.has('completed')}
                onToggle={() => toggleSection('completed')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskSectionProps {
  title: string;
  tasks: any[];
  color: 'red' | 'blue' | 'gray' | 'green';
  isCollapsed: boolean;
  onToggle: () => void;
}

function TaskSection({ title, tasks, color, isCollapsed, onToggle }: TaskSectionProps) {
  const colorMap = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
    green: 'bg-green-500'
  };

  const badgeColorMap = {
    red: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn("w-3 h-3 rounded-full", colorMap[color])} />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <Badge className={cn("text-xs px-2 py-1 rounded-full font-medium", badgeColorMap[color])}>
            {tasks.length} tasks
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
          title={isCollapsed ? 'Expand section' : 'Collapse section'}
        >
          <ChevronUp className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
