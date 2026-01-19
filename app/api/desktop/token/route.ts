import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const userId = (session?.user as any)?.id;

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

    // Redirect back to custom protocol (Tauri is listening)
    return NextResponse.redirect(`autocut://auth?token=${token}`);
  } catch (error) {
    console.error('Failed to create desktop token:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}


