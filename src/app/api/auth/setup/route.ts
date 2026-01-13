import { NextResponse } from 'next/server';
import { generateTOTPSecret, generateTOTPUri } from '@/lib/auth';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const existingSecret = process.env.TOTP_SECRET;
    
    if (existingSecret) {
      return NextResponse.json({
        hasExisting: true,
        existingSecret,
        secret: '',
        qrCodeDataUrl: '',
      });
    }

    const secret = generateTOTPSecret();
    const uri = generateTOTPUri(secret);
    const qrCodeDataUrl = await QRCode.toDataURL(uri);

    return NextResponse.json({
      hasExisting: false,
      secret,
      qrCodeDataUrl,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    );
  }
}
