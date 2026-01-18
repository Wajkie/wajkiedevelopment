'use server';

import { getSession, verifyTOTP, generateTOTPSecret, generateTOTPUri } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';

export async function setupAuth() {
  const existingSecret = process.env.TOTP_SECRET;
  
  if (existingSecret) {
    return {
      hasExisting: true,
      existingSecret,
      secret: '',
      qrCodeDataUrl: '',
    };
  }

  const secret = await generateTOTPSecret();
  const uri = await generateTOTPUri(secret);
  const qrCodeDataUrl = await QRCode.toDataURL(uri);

  return {
    hasExisting: false,
    secret,
    qrCodeDataUrl,
  };
}

export async function verifyAuthCode(code: string) {
  if (!code || code.length !== 6) {
    throw new Error('Ogiltig kod');
  }

  const isValid = await verifyTOTP(code);

  if (!isValid) {
    throw new Error('Fel kod. Försök igen.');
  }

  // Set session
  const session = await getSession();
  session.isAuthenticated = true;
  session.authenticatedAt = Date.now();
  await session.save();

  return { success: true };
}

export async function logoutUser() {
  const session = await getSession();
  session.destroy();
  redirect('/auth/signin');
}
