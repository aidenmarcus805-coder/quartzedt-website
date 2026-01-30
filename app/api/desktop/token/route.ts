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
            .card { background: transparent; padding: 48px; border-radius: 24px; text-align: center; max-width: 400px; width: 100%; display: flex; flex-direction: column; align-items: center; }
            h1 { margin: 24px 0 12px; font-weight: 600; font-size: 24px; letter-spacing: -0.5px; }
            p.sub { color: #666; margin: 0 0 32px; font-size: 15px; line-height: 1.5; }
            
            .code-container { display: none; margin-top: 20px; animation: fadeIn 0.5s ease; }
            .code { font-family: "SF Mono", "Monaco", "Inconsolata", monospace; font-size: 24px; letter-spacing: 4px; font-weight: 700; color: #fff; background: #222; padding: 12px 24px; border-radius: 8px; margin-bottom: 12px; }
            
            .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; }
            
            .btn-primary { background: white; color: black; border: none; font-size: 15px; font-weight: 600; padding: 14px 40px; border-radius: 12px; cursor: pointer; text-decoration: none; margin-top: 24px; transition: opacity 0.2s; box-shadow: 0 0 40px rgba(255,255,255,0.1); }
            .btn-primary:hover { opacity: 0.9; }

            .btn-link { background: transparent; color: #444; border: none; font-size: 13px; cursor: pointer; text-decoration: underline; margin-top: 16px; transition: color 0.2s; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h1>Opening Quartz...</h1>
            <p class="sub">You can close this browser tab once the app opens.</p>
            
            <div class="code-container" id="manual">
               <div class="code" id="code" onclick="copyCode()">${code}</div>
               <p style="font-size: 12px; color: #444;">Click code to copy</p>
            </div>

            <a href="autocut://auth?token=${code}" class="btn-primary" id="open-btn">Open Quartz</a>
            
            <button onclick="showManual()" class="btn-link">App didn't open?</button>
          </div>
          
          <script>
            function copyCode() {
              const code = document.getElementById('code').innerText;
              navigator.clipboard.writeText(code);
              alert('Copied');
            }

            function showManual() {
                document.getElementById('manual').style.display = 'block';
                document.getElementById('open-btn').innerText = 'Retry Opening App';
            }
            
            // Wait for 2 seconds, if user hasn't clicked, show manual instructions
            setTimeout(() => {
                const manual = document.getElementById('manual');
                if (manual.style.display !== 'block') {
                    // We don't force redirect anymore as browsers block it
                    // Instead we let the user click the primary button
                }
            }, 3000);
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
