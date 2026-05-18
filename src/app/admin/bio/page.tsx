import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BioEditor from './BioEditor';
import { db } from '@/lib/db';
import { getTranslations } from '@/lib/i18n/server';

export default async function AdminBioPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const [tr, bio] = await Promise.all([
    getTranslations(),
    db.selectFrom('bio').selectAll().executeTakeFirst(),
  ]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{tr.admin.bio.title}</h1>
      {bio ? <BioEditor initialData={bio} /> : <p>{tr.admin.bio.noBio}</p>}
    </div>
  );
}
