import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email, gpu, weddings } = await req.json();

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { message: 'Invalid email address.' },
                { status: 400 }
            );
        }

        try {
            await prisma.waitlist.create({
                data: {
                    email,
                    gpu,
                    weddingsPerYear: weddings,
                },
            });
        } catch (e: any) {
            if (e.code === 'P2002') {
                // Unique constraint violation (email already exists)
                // We return 200 OK to not leak information, or we can just say "You're already on the list!"
                return NextResponse.json(
                    { message: "You're already on the list!" },
                    { status: 200 }
                );
            }
            throw e;
        }

        return NextResponse.json(
            { message: "You're on the list." },
            { status: 201 }
        );
    } catch (error) {
        console.error('Waitlist error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
