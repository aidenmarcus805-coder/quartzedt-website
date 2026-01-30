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
            body { background: #0c0c0c; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1f1f1f; padding: 48px; border-radius: 24px; text-align: center; border: 1px solid #333; box-shadow: 0 20px 40px rgba(0,0,0,0.6); max-width: 400px; width: 100%; }
            h1 { margin: 0 0 16px; font-weight: 600; font-size: 24px; letter-spacing: -0.5px; }
            p.sub { color: #888; margin: 0 0 32px; font-size: 15px; line-height: 1.5; }
            .code { font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace; font-size: 42px; letter-spacing: 8px; font-weight: 700; color: white; margin: 0 0 32px; display: block; user-select: all; cursor: pointer; }
            
            .btn-primary { background: white; color: black; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px; width: 100%; transition: transform 0.1s, background 0.2s; display: block; text-decoration: none; box-sizing: border-box; }
            .btn-primary:hover { background: #e0e0e0; transform: translateY(-1px); }
            .btn-primary:active { transform: translateY(0); }

            .btn-secondary { background: transparent; color: #666; border: 1px solid #333; padding: 12px; border-radius: 12px; font-weight: 500; cursor: pointer; font-size: 14px; margin-top: 12px; width: 100%; transition: all 0.2s; }
            .btn-secondary:hover { border-color: #555; color: #888; }
            
            .toast { position: fixed; bottom: 24px; background: white; color: black; padding: 12px 24px; border-radius: 50px; font-weight: 500; opacity: 0; transform: translateY(20px); transition: all 0.3s; pointer-events: none; }
            .toast.show { opacity: 1; transform: translateY(0); }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Initialize Quartz</h1>
            <p class="sub">Your workstation is ready to connect.<br>The app should open automatically.</p>
            
            <div class="code" id="code" onclick="copyCode()" title="Click to copy">${code}</div>
            
            <a href="autocut://auth?token=${code}" class="btn-primary">Launch Desktop App</a>
            <button onclick="copyCode()" class="btn-secondary">Copy Code Manually</button>
          </div>
          
          <div class="toast" id="toast">Copied to clipboard</div>

          <script>
            function copyCode() {
              const code = document.getElementById('code').innerText;
              navigator.clipboard.writeText(code);
              const toast = document.getElementById('toast');
              toast.classList.add('show');
              setTimeout(() => toast.classList.remove('show'), 2000);
            }
            
            // Auto-redirect
            setTimeout(() => {
                window.location.href = 'autocut://auth?token=${code}';
            }, 500);
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
