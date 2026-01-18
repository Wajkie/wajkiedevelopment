import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserRepos } from '@/lib/github';

export async function GET() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const repos = await getUserRepos();
    
    // Dela upp i två listor
    const withPipelines = repos.filter(repo => repo.has_workflows && !repo.fork && !repo.archived);
    const withoutPipelines = repos.filter(repo => !repo.has_workflows && !repo.fork && !repo.archived);

    return NextResponse.json({
      withPipelines,
      withoutPipelines,
    });
  } catch (error) {
    console.error('Fel vid hämtning av repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
