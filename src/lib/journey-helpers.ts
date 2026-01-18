import type { Selectable } from 'kysely';
import type { JourneyEntryTable } from './db';
import type { JourneyEntry } from '@/types';

/**
 * Transform database journey entry to API format
 */
export function dbToJourneyEntry(entry: Selectable<JourneyEntryTable>): JourneyEntry {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    date: entry.date,
    period: entry.period,
    images: entry.images,
    learnings: entry.learnings,
    result: entry.result ?? undefined,
    tags: entry.tags,
    links: entry.links,
    orderIndex: entry.orderIndex,
  };
}
