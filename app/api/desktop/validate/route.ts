import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: Request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'missing_token' }, { status: 400, headers });
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
                        image: true,
                        plan: true,
                    },
                },
            },
        });

        if (!desktopToken) {
            return NextResponse.json({ error: 'invalid_token' }, { status: 401, headers });
        }

        // Check if expired
        if (new Date() > desktopToken.expiresAt) {
            // Clean up expired token
            await prisma.desktopToken.delete({ where: { id: desktopToken.id } });
            return NextResponse.json({ error: 'token_expired' }, { status: 401, headers });
        }

        // Token is valid! Return user data
        return NextResponse.json({
            user: desktopToken.user,
        }, { headers });
    } catch (error) {
        console.error('Desktop token validation error:', error);
        return NextResponse.json({ error: 'internal_error' }, { status: 500, headers });
    }
}
