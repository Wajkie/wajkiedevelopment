'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { dbToJourneyEntry } from '@/lib/journey-helpers';
import { redirect } from 'next/navigation';
import type { JourneyEntry } from '@/types';

export async function getJourneyEntries() {
  const entries = await db
    .selectFrom('journeyEntries')
    .selectAll()
    .orderBy('orderIndex', 'asc')
    .execute();

  const journeyEntries: JourneyEntry[] = entries.map(dbToJourneyEntry);
  return journeyEntries;
}

type CreateJourneyEntryData = Omit<JourneyEntry, 'id'>;

export async function createJourneyEntry(data: CreateJourneyEntryData) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const newEntry = await db
    .insertInto('journeyEntries')
    .values({
      title: data.title,
      description: data.description,
      date: data.date,
      period: data.period,
      images: data.images,
      learnings: data.learnings,
      result: data.result ?? null,
      tags: data.tags,
      links: data.links,
      orderIndex: data.orderIndex,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return newEntry;
}

export async function updateJourneyEntries(entries: JourneyEntry[]) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  // Delete all existing entries
  await db.deleteFrom('journeyEntries').execute();

  // Insert new entries
  if (entries.length > 0) {
    await db
      .insertInto('journeyEntries')
      .values(
        entries.map((entry, index) => ({
          title: entry.title,
          description: entry.description,
          date: entry.date,
          period: entry.period,
          images: entry.images,
          learnings: entry.learnings,
          result: entry.result ?? null,
          tags: entry.tags,
          links: entry.links,
          orderIndex: index,
        }))
      )
      .execute();
  }

  return { success: true };
}

export async function deleteJourneyEntry(id: number) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  await db
    .deleteFrom('journeyEntries')
    .where('id', '=', id)
    .execute();

  return { success: true };
}
