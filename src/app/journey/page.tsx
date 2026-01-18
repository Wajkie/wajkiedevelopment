import { db } from '@/lib/db';
import { dbToJourneyEntry } from '@/lib/journey-helpers';
import { PageContainer, PageHeader } from '@/components/layout';
import { TimelineItem } from '@/components/common';
import type { Metadata } from 'next';
import type { JourneyEntry } from '@/types';

export const metadata: Metadata = {
  title: 'Min Utbildningsresa | Portfolio',
  description: 'En tidsresa genom min utbildning med projekt, lärdomar och resultat',
};

export const revalidate = 300; // 5 minutes

export default async function JourneyPage() {
  const entries = await db
    .selectFrom('journeyEntries')
    .selectAll()
    .orderBy('date', 'desc')
    .orderBy('orderIndex', 'asc')
    .execute();

  const journeyData: JourneyEntry[] = entries.map(dbToJourneyEntry);

  return (
    <PageContainer maxWidth="7xl">
      <PageHeader
        title="Min Utbildningsresa"
        description="En visuell tidsresa genom min utbildning - projekt, lärdomar och tillväxt"
      />

      {journeyData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Innehållet kommer snart...
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />

          {/* Timeline items */}
          <div className="space-y-12">
            {journeyData.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>

          {/* End marker */}
          <div className="flex justify-center pt-8">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
