import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BlogEditorClient from './BlogEditorClient';

export default async function AdminBlogPage() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  return <BlogEditorClient />;
}
