'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import type { BioTable } from '@/lib/db';
import type { Selectable } from 'kysely';

export async function getBio() {
  const bio = await db
    .selectFrom('bio')
    .selectAll()
    .executeTakeFirst();

  if (!bio) {
    throw new Error('Bio not found');
  }

  return bio;
}

export async function updateBio(data: {
  name: string;
  tagline: string;
  shortPitch: string;
  aboutParagraphs: string[];
  contactEmail: string;
  contactGithub: string;
  contactLinkedin: string;
  skillsFrontend: Array<{ name: string; icon: string; color: string }>;
  skillsBackend: Array<{ name: string; icon: string; color: string }>;
  skillsTools: Array<{ name: string; icon: string; color: string }>;
  values: Array<{ title: string; icon: string; description: string }>;
}) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const {
    name,
    tagline,
    shortPitch,
    aboutParagraphs,
    contactEmail,
    contactGithub,
    contactLinkedin,
    skillsFrontend,
    skillsBackend,
    skillsTools,
    values,
  } = data;

  // Uppdatera eller skapa bio (vi har bara en rad)
  const existingBio = await db
    .selectFrom('bio')
    .select('id')
    .executeTakeFirst();

  let updated: Selectable<BioTable> | undefined = undefined;
  
  if (existingBio) {
    // Uppdatera befintlig
    updated = (await db
      .updateTable('bio')
      .set({
        name,
        tagline,
        shortPitch,
        aboutParagraphs,
        contactEmail,
        contactGithub,
        contactLinkedin,
        skillsFrontend,
        skillsBackend,
        skillsTools,
        values,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst()) as Selectable<BioTable> | undefined;
  } else {
    // Skapa ny
    updated = (await db
      .insertInto('bio')
      .values({
        name,
        tagline,
        shortPitch,
        aboutParagraphs,
        contactEmail,
        contactGithub,
        contactLinkedin,
        skillsFrontend,
        skillsBackend,
        skillsTools,
        values,
      })
      .returningAll()
      .executeTakeFirst()) as Selectable<BioTable> | undefined;
  }

  if (!updated) {
    throw new Error('Failed to update bio');
  }

  return updated;
}
