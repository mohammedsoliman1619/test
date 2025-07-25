import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { Task, TaskStatus } from '@shared/schema';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  Calendar,
  CheckCircle,
  Repeat,
  Edit3,
  Trash2,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { t } = useTranslation();
  const { toggleTaskComplete, setSelectedTask, updateTask, deleteTask } = useStore();

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleTaskComplete(task.id);
  };

  const handleSelectTask = () => {
    setSelectedTask(task.id);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open task edit modal
    console.log('Edit task:', task.id);
  };

  const handleDeleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('tasks.delete_confirm', 'Are you sure you want to delete this task?'))) {
      await deleteTask(task.id);
    }
  };

  const handleTaskOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open task options menu
    console.log('Task options:', task.id);
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return {
        text: `${t('date.today', 'Today')} ${format(date, 'h:mm a')}`,
        color: 'text-red-600 dark:text-red-400'
      };
    }
    
    if (isTomorrow(date)) {
      return {
        text: `${t('date.tomorrow', 'Tomorrow')} ${format(date, 'h:mm a')}`,
        color: 'text-orange-600 dark:text-orange-400'
      };
    }
    
    if (isPast(date) && task.status !== TaskStatus.COMPLETED) {
      return {
        text: `${formatDistanceToNow(date, { addSuffix: true })}`,
        color: 'text-red-600 dark:text-red-400'
      };
    }
    
    return {
      text: format(date, 'MMM d, h:mm a'),
      color: 'text-gray-500 dark:text-gray-400'
    };
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <div
      onClick={handleSelectTask}
      className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
    >
      {/* Checkbox */}
      <div className="mt-1">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleComplete}
          className="h-5 w-5"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title */}
            <p className={cn(
              "text-sm font-medium",
              isCompleted 
                ? "text-gray-500 dark:text-gray-400 line-through"
                : "text-gray-900 dark:text-white"
            )}>
              {task.title}
            </p>
            
            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}
            
            {/* Meta Information */}
            <div className="flex items-center space-x-3 mt-2">
              {/* Due Date */}
              {dueInfo && (
                <div className={cn("flex items-center space-x-1 text-xs", dueInfo.color)}>
                  <Calendar className="w-3 h-3" />
                  <span>{dueInfo.text}</span>
                </div>
              )}
              
              {/* Recurrence */}
              {task.recurrence.type !== 'none' && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Repeat className="w-3 h-3" />
                  <span>{t(`recurrence.${task.recurrence.type}`, task.recurrence.type)}</span>
                </div>
              )}
              
              {/* Time tracking */}
              {task.estimatedMinutes && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedMinutes}m</span>
                </div>
              )}
              
              {/* Completed At */}
              {isCompleted && task.completedAt && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>
                    {t('tasks.completed_at', 'Completed {{time}}', {
                      time: formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })
                    })}
                  </span>
                </div>
              )}
              
              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex space-x-1">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditTask}
              className="h-7 w-7"
              title={t('actions.edit', 'Edit')}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteTask}
              className="h-7 w-7"
              title={t('actions.delete', 'Delete')}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTaskOptions}
              className="h-7 w-7"
              title={t('actions.more', 'More options')}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
