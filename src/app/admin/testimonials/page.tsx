import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TestimonialsClient from './TestimonialsClient';

export default async function AdminTestimonialsPage() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  return <TestimonialsClient />;
}
