import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isAuthenticated: boolean;
  authenticatedAt: number;
}

const getSessionOptions = () => {
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
};

export const getSession = async () => {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
};

// Lazy load otplib only when needed for auth operations
export const verifyTOTP = async (token: string): Promise<boolean> => {
  const secret = process.env.TOTP_SECRET;
  if (!secret) return false;
  
  try {
    // Dynamic import to avoid loading otplib in all bundles
    const { verify } = await import('otplib');
    const result = await verify({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
};

export const generateTOTPSecret = async (): Promise<string> => {
  // Dynamic import
  const { generateSecret } = await import('otplib');
  return generateSecret();
};

export const generateTOTPUri = async (secret: string, accountName: string = 'admin'): Promise<string> => {
  // Dynamic import
  const { generateURI } = await import('otplib');
  return generateURI({
    secret,
    label: accountName,
    issuer: 'WajkieDev Portfolio',
  });
};
