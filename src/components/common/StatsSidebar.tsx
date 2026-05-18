'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

interface StatsSidebarProps {
  latestPost: {
    slug: string;
    title: string;
    excerpt: string | null;
  } | null;
  totalProjects: number;
  totalPosts: number;
  npmPackages: number;
  workflowStats: {
    success: number;
    failed: number;
    running: number;
    total: number;
  };
}

export default function StatsSidebar({
  latestPost,
  totalProjects,
  totalPosts,
  npmPackages,
  workflowStats,
}: StatsSidebarProps) {
  const tr = useTranslations();

  return (
    <div className="space-y-6">
      {/* Latest Blog Post */}
      {latestPost && (
        <Card as="section" aria-labelledby="blog-title">
          <CardHeader>
            <CardTitle id="blog-title" as="h2">
              {tr.stats.latestPost}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{latestPost.title}</h3>
            {latestPost.excerpt && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {latestPost.excerpt}
              </p>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href={`/blog/${latestPost.slug}`}>
                {tr.common.readMoreArrow}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card as="section" aria-labelledby="stats-title">
        <CardHeader>
          <CardTitle id="stats-title" as="h2">
            {tr.stats.quickStats}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-xs text-muted-foreground">{tr.stats.projects}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{totalPosts}</p>
              <p className="text-xs text-muted-foreground">{tr.stats.posts}</p>
            </div>
          </div>

          {npmPackages > 0 && (
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{npmPackages}</p>
              <p className="text-xs text-muted-foreground">{tr.stats.npmPackages}</p>
            </div>
          )}

          {/* CI/CD Stats */}
          {workflowStats.total > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">
                {tr.stats.cicdStatus}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/10 rounded-lg p-2 text-center">
                  <p className="text-xl font-bold text-green-400">{workflowStats.success}</p>
                  <p className="text-xs text-muted-foreground">{tr.stats.success}</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-2 text-center">
                  <p className="text-xl font-bold text-red-400">{workflowStats.failed}</p>
                  <p className="text-xs text-muted-foreground">{tr.stats.failed}</p>
                </div>
              </div>
              {workflowStats.running > 0 && (
                <div className="bg-yellow-500/10 rounded-lg p-2 text-center mt-2">
                  <p className="text-xl font-bold text-yellow-400">{workflowStats.running}</p>
                  <p className="text-xs text-muted-foreground">{tr.stats.running}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-border space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/projects">{tr.stats.viewProjects}</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/blog">{tr.stats.readBlog}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
