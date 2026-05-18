import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { dbToJourneyEntry } from '@/lib/journey-helpers';
import JourneyEditor from './JourneyEditor';
import { getTranslations } from '@/lib/i18n/server';

export default async function JourneyAdminPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const [tr, entries] = await Promise.all([
    getTranslations(),
    db.selectFrom('journeyEntries').selectAll().orderBy('orderIndex', 'asc').execute(),
  ]);

  const journeyData = entries.map(entry => ({
    ...dbToJourneyEntry(entry),
    result: entry.result ?? '',
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{tr.admin.journey.title}</h1>
        <JourneyEditor initialData={journeyData} />
      </div>
    </div>
  );
}
