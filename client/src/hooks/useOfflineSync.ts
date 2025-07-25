import { useState, useEffect } from 'react';
import { useStore } from '../store';

export interface OfflineSyncState {
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSync: Date | null;
  queuedChanges: number;
}

export function useOfflineSync() {
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: navigator.onLine,
    syncStatus: 'idle',
    lastSync: null,
    queuedChanges: 0
  });

  const { updateAnalytics } = useStore();

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      // Trigger sync when coming back online
      syncData();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!state.isOnline) return;

    setState(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      // Update analytics data
      await updateAnalytics();
      
      // Simulate sync delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        syncStatus: 'idle',
        lastSync: new Date(),
        queuedChanges: 0
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setState(prev => ({ ...prev, syncStatus: 'error' }));
    }
  };

  const registerChange = () => {
    setState(prev => ({ ...prev, queuedChanges: prev.queuedChanges + 1 }));
  };

  // Auto sync every 5 minutes when online
  useEffect(() => {
    if (!state.isOnline) return;

    const interval = setInterval(syncData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.isOnline]);

  return {
    ...state,
    syncData,
    registerChange
  };
}
