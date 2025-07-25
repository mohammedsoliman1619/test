import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { Plus, Calendar, Tag, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskPriority } from '@shared/schema';

export function QuickAdd() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { createTask, currentProjectId, getInboxProject } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const projectId = currentProjectId || getInboxProject()?.id;
    if (!projectId) return;

    try {
      await createTask({
        title: title.trim(),
        projectId,
        priority: TaskPriority.P4,
        status: 'todo',
        tags: [],
        recurrence: { type: 'none', interval: 1 },
        order: 0
      });
      
      setTitle('');
      setShowOptions(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setShowOptions(true);
    } else if (e.key === 'Escape') {
      setTitle('');
      setShowOptions(false);
    }
  };

  const openTaskModal = () => {
    // TODO: Open full task creation modal
    console.log('Open task modal');
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t('tasks.add_placeholder', 'Add a task... (Press Enter to save, Tab for options)')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowOptions(false)}
            className="pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </form>

      {/* Quick Options */}
      {showOptions && title.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {t('tasks.quick_options', 'Quick Options')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={openTaskModal}
              className="text-xs"
            >
              {t('tasks.full_editor', 'Full Editor')}
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 justify-start"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('tasks.due_date', 'Due Date')}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 justify-start"
            >
              <Flag className="w-4 h-4" />
              <span>{t('tasks.priority', 'Priority')}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 justify-start"
            >
              <Tag className="w-4 h-4" />
              <span>{t('tasks.tags', 'Tags')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
