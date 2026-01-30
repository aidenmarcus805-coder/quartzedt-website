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
          <title>Opening Quartz...</title>
          <style>
            body { 
                background: #000; 
                color: #fff; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                margin: 0;
            }
            .spinner {
                width: 24px;
                height: 24px;
                border: 2px solid rgba(255,255,255,0.2);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-bottom: 24px;
            }
            h1 {
                font-size: 16px;
                font-weight: 500;
                margin: 0 0 12px;
                color: #fff;
            }
            p {
                color: #666;
                font-size: 13px;
                margin: 0;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
            .container { 
                display: flex; 
                flex-direction: column; 
                align-items: center;
                animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
            }
            #trigger {
                opacity: 0;
                position: absolute;
                width: 1px;
                height: 1px;
                pointer-events: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Opening Quartz...</h1>
            <p>You can close this browser tab once the app opens.</p>
          </div>
          
          <a href="autocut://auth?token=${code}" id="trigger">Open</a>

          <script>
             const trigger = document.getElementById('trigger');
             // Attempt click for user gesture emulation if possible
             setTimeout(() => {
                 trigger.click();
             }, 100);
             
             // Fallback redirect
             setTimeout(() => {
                 window.location.href = "autocut://auth?token=${code}";
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
