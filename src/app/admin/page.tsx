import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getAllPostsFromGitHub, getUserRepos } from '@/lib/github';
import DashboardClient from './DashboardClient';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  // Fetch dashboard stats
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);
  const [recentVisits, blogPosts, repos] = await Promise.all([
    // Recent visits (last 7 days)
    db
      .selectFrom('pageVisits')
      .select((eb) => eb.fn.count('id').as('visits'))
      .where('timestamp', '>', sevenDaysAgo)
      .executeTakeFirst()
      .then(result => Number(result?.visits || 0))
      .catch(() => 0),
    
    // Blog posts count
    getAllPostsFromGitHub()
      .then(posts => posts.length)
      .catch(() => 0),
    
    // Repositories count
    getUserRepos()
      .then(repos => repos.length)
      .catch(() => 0),
  ]);

  return (
    <DashboardClient 
      recentVisits={recentVisits}
      blogPostsCount={blogPosts}
      reposCount={repos}
    />
  );
}
