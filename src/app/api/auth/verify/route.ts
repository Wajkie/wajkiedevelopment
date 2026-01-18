import { NextRequest, NextResponse } from 'next/server';
import { verifyTOTP, getSession } from '@/lib/auth';

interface VerifyBody {
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json() as VerifyBody;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Ogiltig kod' },
        { status: 400 }
      );
    }

    const isValid = await verifyTOTP(code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Fel kod. Försök igen.' },
        { status: 401 }
      );
    }

    // Set session
    const session = await getSession();
    session.isAuthenticated = true;
    session.authenticatedAt = Date.now();
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TOTP verification error:', error);
    return NextResponse.json(
      { error: 'Serverfel' },
      { status: 500 }
    );
  }
}
