import { Suspense } from 'react';
import { db } from '@/lib/db';
import { getUserRepos, getWorkflowRuns, getLatestCommit, getNpmPackageCount } from '@/lib/github';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { ActivityFeed, StatsSidebar, PublicStatsWidget } from '@/components/common';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

// Loading fallback components
function ActivityFeedSkeleton() {
  return (
    <Card as="section" aria-labelledby="activity-title" aria-busy="true">
      <CardHeader>
        <CardTitle id="activity-title" as="h2">
          Senaste Aktivitet
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          CI/CD status från mina projekt
        </p>
      </CardHeader>
      <div className="p-6 space-y-4">
        <span className="sr-only" aria-live="polite">Laddar aktivitetsflöde...</span>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-4 animate-pulse" aria-hidden="true">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded-full"></div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatsSidebarSkeleton() {
  return (
    <Card aria-busy="true">
      <CardHeader>
        <CardTitle as="h2">Översikt</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-4 animate-pulse">
        <span className="sr-only" aria-live="polite">Laddar statistik...</span>
        <div className="h-4 bg-muted rounded w-3/4" aria-hidden="true"></div>
        <div className="h-4 bg-muted rounded w-2/3" aria-hidden="true"></div>
        <div className="h-4 bg-muted rounded w-1/2" aria-hidden="true"></div>
      </div>
    </Card>
  );
}

function PublicStatsWidgetSkeleton() {
  return (
    <Card aria-busy="true">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle as="h2">Live Stats</CardTitle>
          <div className="h-5 w-12 bg-muted rounded-full" aria-hidden="true"></div>
        </div>
      </CardHeader>
      <div className="p-6 space-y-4 animate-pulse">
        <span className="sr-only" aria-live="polite">Laddar live statistik...</span>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} aria-hidden="true">
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-6 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Server components for data fetching
async function ActivityFeedData() {
  const repos = await getUserRepos();
  const activeRepos = repos.filter(repo => repo.has_workflows).slice(0, 5);

  const reposWithStatus = await Promise.all(
    activeRepos.map(async (repo) => {
      const [runs, commit] = await Promise.all([
        getWorkflowRuns(repo.name),
        getLatestCommit(repo.name),
      ]);
      return { ...repo, runs, commit };
    })
  );

  return <ActivityFeed repos={reposWithStatus} />;
}

async function StatsSidebarData() {
  const [repos, posts, totalPostsResult, npmPackages] = await Promise.all([
    getUserRepos(),
    db.selectFrom('posts').selectAll().orderBy('createdAt', 'desc').limit(1).execute(),
    db.selectFrom('posts').select(db.fn.count('slug').as('count')).executeTakeFirst(),
    getNpmPackageCount(),
  ]);

  const activeRepos = repos.filter(repo => repo.has_workflows).slice(0, 5);
  const reposWithStatus = await Promise.all(
    activeRepos.map(async (repo) => {
      const runs = await getWorkflowRuns(repo.name);
      return { ...repo, runs };
    })
  );

  const allRuns = reposWithStatus.flatMap(repo => repo.runs);
  const workflowStats = {
    total: allRuns.length,
    success: allRuns.filter(run => run.conclusion === 'success').length,
    failed: allRuns.filter(run => run.conclusion === 'failure').length,
    running: allRuns.filter(run => run.status !== 'completed').length,
  };

  return (
    <StatsSidebar
      latestPost={posts[0] ?? null}
      totalProjects={repos.length}
      totalPosts={Number(totalPostsResult?.count ?? 0)}
      npmPackages={npmPackages}
      workflowStats={workflowStats}
    />
  );
}

export default async function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
          <CardHeader>
            <CardTitle as="h1" className="text-5xl mb-4">
              Wajkie Development
            </CardTitle>
            <CardDescription className="text-lg">
              Real-time CI/CD pipelines, deployment status & live analytics
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Grid Layout with Suspense boundaries */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<ActivityFeedSkeleton />}>
          <ActivityFeedData />
        </Suspense>
        
        <div className="space-y-6">
          <Suspense fallback={<PublicStatsWidgetSkeleton />}>
            <PublicStatsWidget />
          </Suspense>
          
          <Suspense fallback={<StatsSidebarSkeleton />}>
            <StatsSidebarData />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
