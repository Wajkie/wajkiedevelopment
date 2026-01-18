'use server';

import { db } from '@/lib/db';

export async function getPublicStats() {
  // Total visits count
  const totalVisitsResult = await db
    .selectFrom('pageVisits')
    .select((eb) => eb.fn.count('id').as('totalVisits'))
    .executeTakeFirst();

  // Unique visitors - get all unique IP hashes
  const uniqueIPs = await db
    .selectFrom('pageVisits')
    .select('ipHash')
    .distinct()
    .execute();

  // Popular pages (top 5 för public)
  const popularPages = await db
    .selectFrom('pageVisits')
    .select((eb) => [
      'pagePath',
      eb.fn.count('id').as('visits'),
    ])
    .where('pagePath', 'is not', null)
    .groupBy('pagePath')
    .orderBy('visits', 'desc')
    .limit(5)
    .execute();

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentVisits = await db
    .selectFrom('pageVisits')
    .select((eb) => [
      eb.fn.count('id').as('visits'),
    ])
    .where('timestamp', '>', sevenDaysAgo)
    .executeTakeFirst();

  return {
    totalVisits: Number(totalVisitsResult?.totalVisits || 0),
    uniqueVisitors: uniqueIPs.length,
    recentVisits: Number(recentVisits?.visits || 0),
    popularPages: popularPages.map(p => ({
      path: p.pagePath || 'unknown',
      visits: Number(p.visits),
    })).slice(0, 5),
  };
}
