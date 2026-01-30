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
        const { token, machineId, deviceName } = body;

        if (!token || !machineId) {
            return NextResponse.json({ error: 'missing_fields' }, { status: 400, headers });
        }

        // Find the token in the database
        const desktopToken = await prisma.desktopToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!desktopToken) {
            return NextResponse.json({ error: 'invalid_token' }, { status: 401, headers });
        }

        // Check if expired
        if (new Date() > desktopToken.expiresAt) {
            await prisma.desktopToken.delete({ where: { id: desktopToken.id } });
            return NextResponse.json({ error: 'token_expired' }, { status: 401, headers });
        }

        // DEVICE LIMIT LOGIC
        const user = desktopToken.user;
        const userId = user.id;

        // Check if this device is already registered
        const existingDevice = await prisma.desktopDevice.findUnique({
            where: {
                userId_machineId: {
                    userId,
                    machineId,
                },
            },
        });

        let device;

        if (existingDevice) {
            // Update last seen
            device = await prisma.desktopDevice.update({
                where: { id: existingDevice.id },
                data: { lastSeen: new Date(), name: deviceName || existingDevice.name },
            });
        } else {
            // New device - check limit
            const deviceCount = await prisma.desktopDevice.count({
                where: { userId },
            });

            if (deviceCount >= 2) {
                return NextResponse.json({
                    error: 'device_limit_reached',
                    message: 'You have reached the maximum of 2 devices. Please manage your devices in the dashboard.'
                }, { status: 403, headers });
            }

            // Register new device
            device = await prisma.desktopDevice.create({
                data: {
                    userId,
                    machineId,
                    name: deviceName || 'Desktop App',
                },
            });
        }

        // Clean up token after successful use (OTP)
        await prisma.desktopToken.delete({ where: { id: desktopToken.id } });

        // Token is valid! Return user data AND the persistent session token
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                plan: user.plan,
            },
            accessToken: device.accessToken, // <--- CRITICAL FOR PERSISTENCE
        }, { headers });

    } catch (error) {
        console.error('Desktop token validation error:', error);
        return NextResponse.json({ error: 'internal_error' }, { status: 500, headers });
    }
}
