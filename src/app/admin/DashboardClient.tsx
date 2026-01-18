'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { logoutUser } from '@/lib/actions/auth';

type DashboardClientProps = {
  recentVisits: number;
  blogPostsCount: number;
  reposCount: number;
};

export default function DashboardClient({ recentVisits, blogPostsCount, reposCount }: DashboardClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
  };

  const adminSections = [
    {
      title: 'Blog Editor',
      description: 'Skriv och publicera nya blogginlägg med markdown',
      icon: '✍️',
      href: '/admin/blog',
      color: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Analytics',
      description: 'Visitor tracking, statistik och API tokens',
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Testimonials',
      description: 'Granska och godkänn inkomna testimonials',
      icon: '💬',
      href: '/admin/testimonials',
      color: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      title: 'Projects',
      description: 'Hantera visade projekt och GitHub repositories',
      icon: '📁',
      href: '/admin/projects',
      color: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Bio',
      description: 'Redigera personlig information och kompetenser',
      icon: '👤',
      href: '/admin/bio',
      color: 'from-orange-500/10 to-amber-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: 'Journey',
      description: 'Tidslinje över projekt och milstolpar',
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
                  Admin Dashboard
                </CardTitle>
                <CardDescription>
                  Hantera innehåll, projekt och analytics
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                Logga ut
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader>
              <CardDescription>Senaste 7 dagar</CardDescription>
              <CardTitle className="text-2xl">Besökare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {recentVisits.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Se detaljerad statistik i Analytics
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardHeader>
              <CardDescription>Publicerat innehåll</CardDescription>
              <CardTitle className="text-2xl">Blogginlägg</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {blogPostsCount}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Från GitHub repository
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
            <CardHeader>
              <CardDescription>GitHub aktivitet</CardDescription>
              <CardTitle className="text-2xl">Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {reposCount}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Publika och privata
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-xl font-semibold mb-4 px-1">Hantera innehåll</h2>
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
            <CardTitle>Snabblänkar</CardTitle>
            <CardDescription>Genvägar till vanliga funktioner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => router.push('/admin/blog')}
                size="sm"
              >
                ✍️ Nytt blogginlägg
              </Button>
              <Button
                onClick={() => router.push('/admin/analytics')}
                variant="outline"
                size="sm"
              >
                📊 Se statistik
              </Button>
              <Button
                onClick={() => router.push('/blog')}
                variant="outline"
                size="sm"
              >
                👁️ Visa blogg
              </Button>
              <Button
                onClick={() => router.push('/projects')}
                variant="outline"
                size="sm"
              >
                📂 Visa projekt
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                🏠 Till startsidan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
