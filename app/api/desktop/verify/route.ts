import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return new NextResponse('Missing token', { status: 400 });
        }

        // Find token
        const dbToken = await prisma.desktopToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!dbToken) {
            return new NextResponse('Invalid token', { status: 404 });
        }

        // Check expiry
        if (dbToken.expiresAt < new Date()) {
            return new NextResponse('Token expired', { status: 410 });
        }

        // Return user plan info (The desktop app can use this to unlock features)
        // In a real local-first app, you might return a signed JWT here that the app stores.
        return NextResponse.json({
            valid: true,
            email: dbToken.user.email,
            plan: dbToken.user.plan,
            userId: dbToken.user.id,
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
