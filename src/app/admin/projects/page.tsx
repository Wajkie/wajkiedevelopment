import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  return <ProjectsClient />;
}
