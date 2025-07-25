import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '../store';

export function useKeyboardShortcuts() {
  const [, setLocation] = useLocation();
  const { setCurrentView, setSearchQuery } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not focused on input elements
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle modifier key shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case 'n':
            e.preventDefault();
            // Open quick add (TODO: implement modal)
            console.log('Open quick add modal');
            break;
          case '/':
            e.preventDefault();
            // Clear search
            setSearchQuery('');
            break;
        }
        return;
      }

      // Handle navigation shortcuts
      switch (e.key) {
        case '1':
          e.preventDefault();
          setLocation('/tasks');
          break;
        case '2':
          e.preventDefault();
          setLocation('/calendar');
          break;
        case '3':
          e.preventDefault();
          setLocation('/goals');
          break;
        case '4':
          e.preventDefault();
          setLocation('/reminders');
          break;
        case '5':
          e.preventDefault();
          setLocation('/analytics');
          break;
        case '6':
          e.preventDefault();
          setLocation('/settings');
          break;
        case 't':
          e.preventDefault();
          setCurrentView('today');
          setLocation('/tasks');
          break;
        case 'u':
          e.preventDefault();
          setCurrentView('upcoming');
          setLocation('/tasks');
          break;
        case 'o':
          e.preventDefault();
          setCurrentView('overdue');
          setLocation('/tasks');
          break;
        case 'Escape':
          e.preventDefault();
          // Close any open modals or clear selections
          // TODO: Implement modal management
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setLocation, setCurrentView, setSearchQuery]);

  // Show keyboard shortcuts help
  useEffect(() => {
    const handleHelp = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // TODO: Show keyboard shortcuts modal
        console.log('Show keyboard shortcuts help');
      }
    };

    document.addEventListener('keydown', handleHelp);
    return () => document.removeEventListener('keydown', handleHelp);
  }, []);
}
