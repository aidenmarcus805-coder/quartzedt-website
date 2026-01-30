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
            body { 
                background: #000; 
                color: #fff; 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                margin: 0;
            }
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 24px;
                opacity: 0;
                animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .spinner {
                width: 24px;
                height: 24px;
                border: 2px solid rgba(255,255,255,0.1);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            h1 {
                font-size: 14px;
                font-weight: 500;
                color: rgba(255,255,255,0.9);
                margin: 0;
                letter-spacing: -0.01em;
            }
            .btn-primary {
                background: #fff;
                color: #000;
                border: none;
                padding: 10px 24px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.2s;
                opacity: 0;
                animation: fadeIn 0.5s ease 1s forwards; /* Delay button appearance */
            }
            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(255,255,255,0.2);
            }
            .code-btn {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.4);
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 11px;
                margin-top: 32px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .code-btn:hover {
                color: rgba(255,255,255,0.8);
                border-color: rgba(255,255,255,0.2);
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Connecting to Quartz...</h1>
            <a href="autocut://auth?token=${code}" class="btn-primary" id="open-btn">Open App</a>
          </div>

          <button onclick="copyCode()" class="code-btn" title="Copy Manual Code">
              Use Connection Code
          </button>
          <div style="display:none;" id="code">${code}</div>
          
          <script>
            function copyCode() {
              const code = document.getElementById('code').innerText;
              navigator.clipboard.writeText(code);
              const btn = document.querySelector('.code-btn');
              const original = btn.innerText;
              btn.innerText = 'Copied';
              setTimeout(() => btn.innerText = original, 2000);
            }
            
            // Auto click
            setTimeout(() => {
                 document.getElementById('open-btn').click();
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
