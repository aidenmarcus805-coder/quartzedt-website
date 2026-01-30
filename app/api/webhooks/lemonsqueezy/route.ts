import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        const clone = req.clone();
        const eventType = req.headers.get('X-Event-Name');
        const signature = req.headers.get('X-Signature');
        const rawBody = await clone.text();

        if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
            console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not set');
            return NextResponse.json({ message: 'Secret not set' }, { status: 500 });
        }

        // Verify signature
        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature || '', 'utf8');

        if (
            !signature ||
            digest.length !== signatureBuffer.length ||
            !crypto.timingSafeEqual(digest, signatureBuffer)
        ) {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const body = await req.json();
        const { data, meta } = body;
        const attributes = data.attributes;

        // Get email from payload - prefer user_email from attributes
        const email = attributes.user_email || meta?.custom_data?.email;

        console.log(`[Webhook] Received ${eventType} for ${email}`);

        if (eventType === 'order_created' || eventType === 'subscription_created') {
            if (attributes.status === 'paid' || attributes.status === 'active') {
                if (email) {
                    await prisma.user.update({
                        where: { email },
                        data: { plan: 'pro' }
                    });
                    console.log(`[Webhook] Upgraded user ${email} to pro`);
                }
            }
        }

        // Handle cancellations/expirations if needed
        if (eventType === 'subscription_cancelled' || eventType === 'subscription_expired') {
            if (email) {
                await prisma.user.update({
                    where: { email },
                    data: { plan: 'free' } // Downgrade
                });
                console.log(`[Webhook] Downgraded user ${email} to free`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Webhook] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
