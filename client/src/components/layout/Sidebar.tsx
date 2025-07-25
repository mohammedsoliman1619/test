import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useStore } from '../../store';
import { useTheme } from '../common/ThemeProvider';
import {
  CheckSquare,
  Calendar,
  Target,
  Bell,
  BarChart3,
  Settings,
  Zap,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  isActive?: boolean;
}

function NavItem({ href, icon: Icon, label, badge, isActive }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 mr-3",
          isActive 
            ? "text-primary-600 dark:text-primary-300" 
            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
        )} />
        <span className="flex-1">{label}</span>
        {badge !== undefined && badge > 0 && (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              isActive 
                ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            )}
          >
            {badge}
          </Badge>
        )}
      </a>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { getTaskStats, getGoalStats } = useStore();

  const taskStats = getTaskStats();
  const goalStats = getGoalStats();

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              ProductivityPro
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('user.pro_user', 'Pro User')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
        <NavItem
          href="/tasks"
          icon={CheckSquare}
          label={t('nav.tasks', 'Tasks')}
          badge={taskStats.total}
          isActive={location === '/' || location === '/tasks'}
        />
        
        <NavItem
          href="/calendar"
          icon={Calendar}
          label={t('nav.calendar', 'Calendar')}
          isActive={location === '/calendar'}
        />
        
        <NavItem
          href="/goals"
          icon={Target}
          label={t('nav.goals', 'Goals')}
          badge={goalStats.inProgress}
          isActive={location === '/goals'}
        />
        
        <NavItem
          href="/reminders"
          icon={Bell}
          label={t('nav.reminders', 'Reminders')}
          isActive={location === '/reminders'}
        />
        
        <NavItem
          href="/analytics"
          icon={BarChart3}
          label={t('nav.analytics', 'Analytics')}
          isActive={location === '/analytics'}
        />

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        <NavItem
          href="/settings"
          icon={Settings}
          label={t('nav.settings', 'Settings')}
          isActive={location === '/settings'}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t('status.offline_ready', 'Offline Ready')}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
            title={t('theme.toggle', 'Toggle theme')}
          >
            <ThemeIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
