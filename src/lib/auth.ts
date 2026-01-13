import { verify, generateSecret, generateURI } from 'otplib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isAuthenticated: boolean;
  authenticatedAt: number;
}

function getSessionOptions() {
  const password = process.env.SESSION_SECRET;
  
  if (!password || password.length < 32) {
    throw new Error(
      'SESSION_SECRET is missing or too short. Generate one with: openssl rand -base64 32'
    );
  }

  return {
    password,
    cookieName: 'totp-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
    },
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

export async function verifyTOTP(token: string): Promise<boolean> {
  const secret = process.env.TOTP_SECRET;
  if (!secret) return false;
  
  try {
    const result = await verify({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
}

export function generateTOTPSecret(): string {
  return generateSecret();
}

export function generateTOTPUri(secret: string, accountName: string = 'admin'): string {
  return generateURI({
    secret,
    label: accountName,
    issuer: 'WajkieDev Portfolio',
  });
}
