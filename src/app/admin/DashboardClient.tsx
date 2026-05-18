'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { logoutUser } from '@/lib/actions/auth';
import { useTranslations } from '@/lib/i18n';

type DashboardClientProps = {
  recentVisits: number;
  blogPostsCount: number;
  reposCount: number;
};

export default function DashboardClient({ recentVisits, blogPostsCount, reposCount }: DashboardClientProps) {
  const router = useRouter();
  const tr = useTranslations();

  const handleLogout = async () => {
    await logoutUser();
  };

  const adminSections = [
    {
      title: tr.admin.dashboard.blogEditor,
      description: tr.admin.dashboard.blogEditorDescription,
      icon: '✍️',
      href: '/admin/blog',
      color: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: tr.admin.dashboard.analytics,
      description: tr.admin.dashboard.analyticsDescription,
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: tr.admin.dashboard.testimonials,
      description: tr.admin.dashboard.testimonialsDescription,
      icon: '💬',
      href: '/admin/testimonials',
      color: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      title: tr.admin.dashboard.projects,
      description: tr.admin.dashboard.projectsDescription,
      icon: '📁',
      href: '/admin/projects',
      color: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: tr.admin.dashboard.bio,
      description: tr.admin.dashboard.bioDescription,
      icon: '👤',
      href: '/admin/bio',
      color: 'from-orange-500/10 to-amber-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: tr.admin.dashboard.journey,
      description: tr.admin.dashboard.journeyDescription,
      icon: '🗺️',
      href: '/admin/journey',
      color: 'from-red-500/10 to-rose-500/10',
      borderColor: 'border-red-500/20',
    },
  ];

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card as="section" aria-labelledby="dashboard-title">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle as="h1" id="dashboard-title" className="text-3xl">
                  {tr.admin.dashboard.title}
                </CardTitle>
                <CardDescription>
                  {tr.admin.dashboard.description}
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                {tr.admin.dashboard.logout}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader>
              <CardDescription>{tr.admin.dashboard.last7Days}</CardDescription>
              <CardTitle className="text-2xl">{tr.admin.dashboard.visitors}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {recentVisits.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {tr.admin.dashboard.viewAnalytics}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardHeader>
              <CardDescription>{tr.admin.dashboard.publishedContent}</CardDescription>
              <CardTitle className="text-2xl">{tr.admin.dashboard.posts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {blogPostsCount}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {tr.admin.dashboard.postsFrom}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
            <CardHeader>
              <CardDescription>{tr.admin.dashboard.githubActivity}</CardDescription>
              <CardTitle className="text-2xl">{tr.admin.dashboard.repos}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {reposCount}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {tr.admin.dashboard.reposDescription}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-xl font-semibold mb-4 px-1">{tr.admin.dashboard.manageContent}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSections.map((section) => (
              <Card
                key={section.href}
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br ${section.color} border-2 ${section.borderColor}`}
                onClick={() => router.push(section.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(section.href);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-3xl" role="img" aria-label={section.title}>
                        {section.icon}
                      </span>
                      {section.title}
                    </CardTitle>
                    <span className="text-muted-foreground">→</span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{tr.admin.dashboard.quickLinks}</CardTitle>
            <CardDescription>{tr.admin.dashboard.quickLinksDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => router.push('/admin/blog')}
                size="sm"
              >
                {tr.admin.dashboard.newPost}
              </Button>
              <Button
                onClick={() => router.push('/admin/analytics')}
                variant="outline"
                size="sm"
              >
                {tr.admin.dashboard.viewStats}
              </Button>
              <Button
                onClick={() => router.push('/blog')}
                variant="outline"
                size="sm"
              >
                {tr.admin.dashboard.viewBlog}
              </Button>
              <Button
                onClick={() => router.push('/projects')}
                variant="outline"
                size="sm"
              >
                {tr.admin.dashboard.viewProjects}
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                {tr.admin.dashboard.home}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
