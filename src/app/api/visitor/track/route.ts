import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// In-memory rate limiter
const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function checkRateLimit(tokenId: number, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(tokenId);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(tokenId, { count: 1, resetAt: now + 60 * 1000 });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = JSON.parse(text) as {
      key: string;
      action: string;
      path?: string;
    };

    if (!body.key || !body.action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find token by comparing hash
    const tokens = await db
      .selectFrom('apiTokens')
      .selectAll()
      .execute();

    let matchedToken: typeof tokens[0] | null = null;
    for (const token of tokens) {
      if (await bcrypt.compare(body.key, token.tokenHash)) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check domain if provided
    const origin = request.headers.get('origin') || request.headers.get('referer');
    const allowedDomains = Array.isArray(matchedToken.allowedDomains) ? matchedToken.allowedDomains : [];
    if (origin && allowedDomains.length > 0) {
      const normalizedOrigin = origin.replace(/https?:\/\//, '').replace(/\/$/, '');
      const allowed = allowedDomains.some(domain =>
        normalizedOrigin.includes(domain.replace(/https?:\/\//, '').replace(/\/$/, ''))
      );
      if (!allowed) {
        return NextResponse.json(
          { error: 'Domain not allowed' },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Rate limit check
    if (!checkRateLimit(matchedToken.id, matchedToken.rateLimit)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: corsHeaders }
      );
    }

    // Hash IP for privacy
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               '0.0.0.0';
    const ipHash = hashIP(ip);

    // Insert visit
    await db
      .insertInto('pageVisits')
      .values({
        tokenId: matchedToken.id,
        action: body.action,
        pagePath: body.path ?? null,
        ipHash,
      })
      .execute();

    // Update last used
    await db
      .updateTable('apiTokens')
      .set({ lastUsedAt: new Date() })
      .where('id', '=', matchedToken.id)
      .execute();

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
