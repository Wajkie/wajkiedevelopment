import { getNpmPackages } from '@/lib/github';
import { NpmPackageCard } from '@/components/common';
import { PageContainer, PageHeader } from '@/components/layout';
import type { Metadata } from 'next';
import { getTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'NPM Packages | Portfolio',
  description: 'Utforska mina publicerade NPM-paket med statistik, nedladdningar och kvalitetsmetrik.',
};

// Revalidate every hour
export const revalidate = 3600;

export default async function PackagesPage() {
  const tr = await getTranslations();
  const packages = await getNpmPackages();

  if (packages.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title={tr.packages.title}
          description={tr.packages.description}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">{tr.packages.noPackages}</p>
        </div>
      </PageContainer>
    );
  }

  // Sortera efter weekly downloads (mest populära först)
  const sortedPackages = [...packages].sort(
    (a, b) => b.downloads.weekly - a.downloads.weekly
  );

  return (
    <PageContainer>
      <PageHeader
        title={tr.packages.title}
        description={tr.packages.descriptionLong}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">{packages.length}</div>
          <div className="text-sm text-muted-foreground">{tr.packages.totalPackages}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {packages.reduce((sum, pkg) => sum + pkg.downloads.weekly, 0)}
          </div>
          <div className="text-sm text-muted-foreground">{tr.packages.weeklyDownloads}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {packages.reduce((sum, pkg) => sum + pkg.downloads.monthly, 0)}
          </div>
          <div className="text-sm text-muted-foreground">{tr.packages.monthlyDownloads}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {(packages.reduce((sum, pkg) => sum + pkg.score.final, 0) / packages.length).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">{tr.packages.avgScore}</div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPackages.map((pkg) => (
          <NpmPackageCard key={pkg.package.name} package={pkg} />
        ))}
      </div>
    </PageContainer>
  );
}
