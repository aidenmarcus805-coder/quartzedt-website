import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { encode } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Short-lived token meant for the desktop app to consume immediately.
  // The desktop app can exchange/validate this token against your backend.
  const secret = process.env.NEXTAUTH_SECRET || 'dev-unsafe-secret';
  const expiresInSeconds = 5 * 60;

  const token = await encode({
    secret,
    maxAge: expiresInSeconds,
    token: {
      sub: email,
      purpose: 'desktop',
    },
  });

  return NextResponse.json({
    token,
    expiresInSeconds,
  });
}


