'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { redirect } from 'next/navigation';

export async function createToken(formData: {
  name: string;
  allowedDomains: string[];
  rateLimit: number;
}) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  // Generate random token (64 chars)
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token for storage
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  const tokenHash = await bcrypt.hash(token, saltRounds);

  // Insert into database
  const newToken = await db
    .insertInto('apiTokens')
    .values({
      name: formData.name,
      tokenHash,
      allowedDomains: formData.allowedDomains,
      rateLimit: formData.rateLimit,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  // Return plain token ONCE (won't be accessible again)
  return {
    id: newToken.id,
    name: newToken.name,
    token, // Only shown once!
    allowedDomains: newToken.allowedDomains,
    rateLimit: newToken.rateLimit,
    createdAt: newToken.createdAt,
    lastUsedAt: newToken.lastUsedAt,
  };
}

export async function getTokens() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const tokens = await db
    .selectFrom('apiTokens')
    .select(['id', 'name', 'allowedDomains', 'rateLimit', 'createdAt', 'lastUsedAt'])
    .orderBy('createdAt', 'desc')
    .execute();

  return tokens;
}

export async function getVisitorStats(tokenId?: number) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  // Total visits count
  const totalVisitsResult = await db
    .selectFrom('pageVisits')
    .$if(tokenId !== undefined, (qb) => qb.where('tokenId', '=', tokenId!))
    .select((eb) => eb.fn.count('id').as('totalVisits'))
    .executeTakeFirst();

  // Unique visitors - get all unique IP hashes
  const uniqueIPs = await db
    .selectFrom('pageVisits')
    .$if(tokenId !== undefined, (qb) => qb.where('tokenId', '=', tokenId!))
    .select('ipHash')
    .distinct()
    .execute();

  // Top pages
  const topPages = await db
    .selectFrom('pageVisits')
    .$if(tokenId !== undefined, (qb) => qb.where('tokenId', '=', tokenId!))
    .select((eb) => [
      'pagePath',
      eb.fn.count('id').as('visits'),
    ])
    .where('pagePath', 'is not', null)
    .groupBy('pagePath')
    .orderBy('visits', 'desc')
    .limit(10)
    .execute();

  // Actions breakdown
  const actionStats = await db
    .selectFrom('pageVisits')
    .$if(tokenId !== undefined, (qb) => qb.where('tokenId', '=', tokenId!))
    .select((eb) => [
      'action',
      eb.fn.count('id').as('count'),
    ])
    .groupBy('action')
    .orderBy('count', 'desc')
    .execute();

  // Recent visits (last 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentVisits = await db
    .selectFrom('pageVisits')
    .$if(tokenId !== undefined, (qb) => qb.where('tokenId', '=', tokenId!))
    .select((eb) => [
      eb.fn.count('id').as('visits'),
    ])
    .where('timestamp', '>', oneDayAgo)
    .executeTakeFirst();

  return {
    totalVisits: Number(totalVisitsResult?.totalVisits || 0),
    uniqueVisitors: uniqueIPs.length,
    recentVisits: Number(recentVisits?.visits || 0),
    topPages: topPages.map(p => ({
      path: p.pagePath || 'unknown',
      visits: Number(p.visits),
    })),
    actions: actionStats.map(a => ({
      action: a.action,
      count: Number(a.count),
    })),
  };
}
