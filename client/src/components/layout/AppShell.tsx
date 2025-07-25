import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { useStore } from '../../store';
import { initializeDefaultData } from '../../lib/db';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { TasksPage } from '../tasks/TasksPage';
import { CalendarPage } from '../calendar/CalendarPage';
import { GoalsPage } from '../goals/GoalsPage';
import { RemindersPage } from '../reminders/RemindersPage';
import { AnalyticsPage } from '../analytics/AnalyticsPage';
import { SettingsPage } from '../settings/SettingsPage';
import { ThemeProvider } from '../common/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../lib/i18n';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppShell() {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const {
    loadTasks,
    loadProjects,
    loadGoals,
    loadReminders,
    loadSettings,
    updateAnalytics
  } = useStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeDefaultData();
        await Promise.all([
          loadSettings(),
          loadProjects(),
          loadTasks(),
          loadGoals(),
          loadReminders()
        ]);
        await updateAnalytics();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = getDirection(i18n.language);
  }, [i18n.language]);

  const openQuickAdd = () => {
    // TODO: Implement quick add modal
    console.log('Open quick add modal');
  };

  return (
    <ThemeProvider>
      <div className="flex h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar onQuickAdd={openQuickAdd} />
          
          <div className="flex-1 min-h-0">
            <Switch>
              <Route path="/" component={TasksPage} />
              <Route path="/tasks" component={TasksPage} />
              <Route path="/calendar" component={CalendarPage} />
              <Route path="/goals" component={GoalsPage} />
              <Route path="/reminders" component={RemindersPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={TasksPage} />
            </Switch>
          </div>
        </main>

        {/* Mobile FAB */}
        <Button
          onClick={openQuickAdd}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl md:hidden z-50"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </ThemeProvider>
  );
}
