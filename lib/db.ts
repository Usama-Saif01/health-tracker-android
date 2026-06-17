import Dexie, { Table } from 'dexie';

export interface HealthMetric {
  id?: number;
  supabase_id?: string;
  metric_type: 'glucose' | 'blood_pressure';
  value?: number; // Optional, to satisfy the generic interface if needed
  payload: any; // Storing the full JSON payload (e.g., systolic, diastolic, pulse, tags, etc.)
  recorded_at: string;
  synced: 0 | 1;
}

export class LocalHealthDatabase extends Dexie {
  metrics!: Table<HealthMetric, number>;

  constructor() {
    super('LocalHealthDatabase');
    this.version(1).stores({
      metrics: '++id, metric_type, synced, recorded_at',
    });
  }
}

export const db = new LocalHealthDatabase();
