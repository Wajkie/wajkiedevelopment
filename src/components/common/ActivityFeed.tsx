import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { RepoWithActivity } from '@/types/github';

interface ActivityFeedProps {
  repos: RepoWithActivity[];
}

export default function ActivityFeed({ repos }: ActivityFeedProps) {
  return (
    <Card as="section" aria-labelledby="activity-title" className="lg:col-span-2">
      <CardHeader>
        <CardTitle id="activity-title" as="h2">
          Senaste Aktivitet
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          CI/CD status från mina projekt
        </p>
      </CardHeader>
      <CardContent>
        {repos.length === 0 ? (
          <p className="text-muted-foreground">Inga aktiva projekt med CI/CD</p>
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg p-4 [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-md)] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{repo.name}</h3>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground">{repo.description}</p>
                    )}
                  </div>
                  {repo.runs[0] && (
                    <span 
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                        repo.runs[0].status === 'completed'
                          ? repo.runs[0].conclusion === 'success'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300 animate-pulse'
                      }`}
                    >
                      {repo.runs[0].status === 'completed'
                        ? repo.runs[0].conclusion === 'success'
                          ? '✓ Success'
                          : '✗ Failed'
                        : '⚡ Running'}
                    </span>
                  )}
                </div>
                {repo.commit && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <p className="truncate">
                      <span className="font-mono text-xs">
                        {repo.commit.sha.slice(0, 7)}
                      </span>
                      {' '}{repo.commit.message.split('\n')[0]}
                    </p>
                    <p className="text-xs mt-1">
                      {new Date(repo.commit.date).toLocaleDateString('sv-SE')} • {repo.commit.author}
                    </p>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
