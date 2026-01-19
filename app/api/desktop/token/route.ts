import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  const email = user?.email ?? null;
  const userId = user?.id;

  if (!email || !userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Create a secure random token for the desktop app
  const token = crypto.randomBytes(32).toString('hex');
  const expiresInSeconds = 10 * 60; // 10 minutes to link
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  try {
    // Store in DB
    await prisma.desktopToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    // Redirect to the handshake UI to attempt deep link + manual fallback
    return NextResponse.redirect(new URL(`/dashboard/handshake?token=${token}`, process.env.NEXTAUTH_URL || 'https://quartzeditor.com'));
  } catch (error) {
    console.error('Failed to create desktop token:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}


