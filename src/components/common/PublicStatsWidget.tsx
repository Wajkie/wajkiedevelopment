'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { getPublicStats } from '@/lib/actions/public-stats';

interface PublicStats {
  totalVisits: number;
  uniqueVisitors: number;
  recentVisits: number;
  popularPages: Array<{ path: string; visits: number }>;
}

export function PublicStatsWidget() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPublicStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        📊 Live Stats
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {stats.totalVisits.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Visits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {stats.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Visitors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {stats.recentVisits.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Last 7 Days</div>
        </div>
      </div>

      {stats.popularPages.length > 0 && (
        <>
          <div className="text-sm font-semibold mb-2">🔥 Popular Pages</div>
          <div className="space-y-2">
            {stats.popularPages.map((page, idx) => (
              <div key={page.path} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">#{idx + 1}</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">
                    {page.path}
                  </span>
                </div>
                <span className="text-xs font-semibold">{page.visits}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
