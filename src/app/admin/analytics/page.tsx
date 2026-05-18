import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';
import { getTokens } from './actions';
import { getTranslations } from '@/lib/i18n/server';

export default async function AnalyticsPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const [tr, tokens] = await Promise.all([getTranslations(), getTokens()]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{tr.admin.analytics.pageTitle}</h1>
        <AnalyticsClient initialTokens={tokens} />
      </div>
    </div>
  );
}
