import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onQuickAdd: () => void;
}

export function TopBar({ onQuickAdd }: TopBarProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { getTaskStats, setSearchQuery: updateSearchQuery } = useStore();

  const taskStats = getTaskStats();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearchQuery(value);
  };

  const showNotifications = () => {
    // TODO: Implement notifications panel
    console.log('Show notifications');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('pages.tasks.title', 'Tasks')}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{taskStats.completed}</span>
            <span>{t('tasks.completed_today', 'completed today')}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('search.placeholder', 'Search tasks, projects, or goals...')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-80 pl-10 bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={showNotifications}
              className="relative"
              title={t('notifications.title', 'Notifications')}
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-red-500 text-white text-xs">
                <span className="sr-only">3 notifications</span>
              </Badge>
            </Button>
            
            <Button onClick={onQuickAdd} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t('actions.quick_add', 'Quick Add')}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
