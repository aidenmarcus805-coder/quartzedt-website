import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'missing_token' }, { status: 400 });
        }

        // Find the token in the database
        const desktopToken = await prisma.desktopToken.findUnique({
            where: { token },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        plan: true,
                    },
                },
            },
        });

        if (!desktopToken) {
            return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
        }

        // Check if expired
        if (new Date() > desktopToken.expiresAt) {
            // Clean up expired token
            await prisma.desktopToken.delete({ where: { id: desktopToken.id } });
            return NextResponse.json({ error: 'token_expired' }, { status: 401 });
        }

        // Token is valid! Return user data
        return NextResponse.json({
            user: desktopToken.user,
        });
    } catch (error) {
        console.error('Desktop token validation error:', error);
        return NextResponse.json({ error: 'internal_error' }, { status: 500 });
    }
}
