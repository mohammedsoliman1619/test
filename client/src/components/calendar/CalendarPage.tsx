import React from 'react';
import { useTranslation } from 'react-i18next';

export function CalendarPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('pages.calendar.title', 'Calendar')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t('pages.calendar.description', 'Interactive calendar with task scheduling and time-blocking capabilities.')}
          </p>
          
          {/* TODO: Implement full calendar functionality */}
          <div className="mt-8 p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {t('common.coming_soon', 'Calendar view coming soon...')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
