import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

// Handle browser redirect flow (e.g. from Google Sign-In)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // If not logged in, redirect to sign in
    return NextResponse.redirect(new URL('/api/auth/signin', process.env.NEXTAUTH_URL ?? 'https://quartzeditor.com'));
  }

  try {
    // Generate a random 6-digit code
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store in DB
    await prisma.desktopToken.create({
      data: {
        userId: session.user.id,
        token: code,
        expiresAt: expiresAt,
      },
    });

    // Return a nice HTML page with the code
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quartz Authentication</title>
          <style>
            body { background: #0c0c0c; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1f1f1f; padding: 40px; border-radius: 16px; text-align: center; border: 1px solid #333; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
            h1 { margin-bottom: 20px; font-weight: 600; }
            .code { font-family: monospace; font-size: 48px; letter-spacing: 4px; background: black; padding: 20px; border-radius: 8px; border: 1px solid #333; color: white; margin: 20px 0; display: block; }
            p { color: #888; margin-bottom: 20px; }
            button { background: white; color: black; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; }
            button:hover { background: #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Authenticate Quartz</h1>
            <p>Return to the desktop app and enter this code:</p>
            <div class="code" id="code">${code}</div>
            <button onclick="copyCode()">Copy Code</button>
            <p style="margin-top: 20px; font-size: 12px;">This tab will not close automatically.</p>
          </div>
          <script>
            function copyCode() {
              const code = document.getElementById('code').innerText;
              navigator.clipboard.writeText(code);
              const btn = document.querySelector('button');
              btn.innerText = 'Copied!';
              setTimeout(() => btn.innerText = 'Copy Code', 2000);
            }
            // Try deep link
            window.location.href = 'autocut://auth?token=${code}';
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Generate a random 6-digit code or short string
    const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars

    // Calculate expiry (e.g., 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store in DB
    await prisma.desktopToken.create({
      data: {
        userId: session.user.id,
        token: code,
        expiresAt: expiresAt,
      },
    });

    return NextResponse.json({ token: code });
  } catch (error) {
    console.error('Token generation error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
