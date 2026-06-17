import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { logGlucoseReading, logBloodPressureReading } from '../app/actions';

export function useOfflineSync(token: string | null) {
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      if (!token) return;
      
      // Wait a moment for connection to stabilize
      setTimeout(async () => {
        setIsSyncing(true);
        try {
          // Find all unsynced records
          const pendingRecords = await db.metrics.where('synced').equals(0).toArray();
          
          if (pendingRecords.length > 0) {
            console.log(`Syncing ${pendingRecords.length} offline records...`);
            
            // Notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('Health Tracker', { body: 'Syncing offline records...' });
            }

            for (const record of pendingRecords) {
              const formData = new FormData();
              
              // Reconstruct FormData from payload
              Object.entries(record.payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  formData.append(key, String(value));
                }
              });

              let success = false;
              try {
                if (record.metric_type === 'glucose') {
                  await logGlucoseReading(formData, token);
                } else if (record.metric_type === 'blood_pressure') {
                  await logBloodPressureReading(formData, token);
                }
                success = true;
              } catch (err) {
                console.error(`Failed to sync record ${record.id}`, err);
              }

              if (success && record.id) {
                // Mark as synced
                await db.metrics.update(record.id, { synced: 1 });
              }
            }

            if (Notification.permission === 'granted') {
              new Notification('Health Tracker', { body: 'All offline records synced successfully!' });
            }
          }
        } catch (error) {
          console.error("Error during offline sync:", error);
        } finally {
          setIsSyncing(false);
          // Dispatch a custom event so the UI can refresh
          window.dispatchEvent(new Event('offline-sync-complete'));
        }
      }, 1000);
    };

    window.addEventListener('online', handleOnline);

    // Also try to sync on mount if online
    if (navigator.onLine && token) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [token]);

  return { isSyncing };
}
