import React from 'react';
import { TasksSidebar } from './TasksSidebar';
import { TasksList } from './TasksList';

export function TasksPage() {
  return (
    <div className="flex h-full">
      <TasksSidebar />
      <TasksList />
    </div>
  );
}
