import { db } from '@/lib/db';
import { getUserRepos, getWorkflowRuns, getLatestCommit, getNpmPackageCount } from '@/lib/github';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ActivityFeed from '@/components/ActivityFeed';
import StatsSidebar from '@/components/StatsSidebar';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Hämta data parallellt
  const [repos, posts, npmPackages] = await Promise.all([
    getUserRepos(),
    db.selectFrom('posts').selectAll().orderBy('createdAt', 'desc').limit(1).execute(),
    getNpmPackageCount(),
  ]);

  // Filtrera bara repos med workflows
  const activeRepos = repos.filter(repo => repo.has_workflows).slice(0, 5);

  // Hämta workflow status för varje aktivt repo
  const reposWithStatus = await Promise.all(
    activeRepos.map(async (repo) => {
      const [runs, commit] = await Promise.all([
        getWorkflowRuns(repo.name),
        getLatestCommit(repo.name),
      ]);
      return { ...repo, runs, commit };
    })
  );

  const latestPost = posts[0] ?? null;
  const totalProjects = repos.length;
  const totalPosts = await db.selectFrom('posts').select(db.fn.count('slug').as('count')).executeTakeFirst();

  // Räkna workflow statistik
  const allRuns = reposWithStatus.flatMap(repo => repo.runs);
  const workflowStats = {
    total: allRuns.length,
    success: allRuns.filter(run => run.conclusion === 'success').length,
    failed: allRuns.filter(run => run.conclusion === 'failure').length,
    running: allRuns.filter(run => run.status !== 'completed').length,
  };

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle as="h1" className="text-5xl mb-4">
              Välkommen till min Portfolio
            </CardTitle>
            <CardDescription className="text-lg">
              Full-stack developer med passion för clean code och modern design
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed repos={reposWithStatus} />
        <StatsSidebar
          latestPost={latestPost}
          totalProjects={totalProjects}
          totalPosts={Number(totalPosts?.count ?? 0)}
          npmPackages={npmPackages}
          workflowStats={workflowStats}
        />
      </div>
    </main>
  );
}
