import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import type { SelectedProject } from '@/types';

export async function GET() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbProjects = await db
      .selectFrom('projects')
      .selectAll()
      .orderBy('orderIndex', 'asc')
      .execute();

    const projects: SelectedProject[] = dbProjects.map(p => ({
      repoId: p.repoId,
      name: p.name,
      description: p.description,
      url: p.url,
      homepage: p.homepage,
      language: p.language,
      stars: p.stars,
      topics: p.topics,
      hasWorkflows: p.hasWorkflows,
      lastCommit: p.lastCommit.toISOString(),
      deploymentUrl: p.deploymentUrl,
      order: p.orderIndex,
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Fel vid hämtning av projekt:', error);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projects }: { projects: SelectedProject[] } = await request.json();
    
    // Ta bort alla befintliga projekt
    await db.deleteFrom('projects').execute();

    // Sätt in nya projekt
    if (projects.length > 0) {
      await db
        .insertInto('projects')
        .values(
          projects.map(p => ({
            repoId: p.repoId,
            name: p.name,
            description: p.description,
            url: p.url,
            homepage: p.homepage,
            language: p.language,
            stars: p.stars,
            topics: p.topics, // Kysely hanterar JSONB automatiskt
            hasWorkflows: p.hasWorkflows,
            lastCommit: new Date(p.lastCommit),
            deploymentUrl: p.deploymentUrl,
            orderIndex: p.order,
          }))
        )
        .execute();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fel vid sparande av projekt:', error);
    return NextResponse.json(
      { error: 'Failed to save projects' },
      { status: 500 }
    );
  }
}
