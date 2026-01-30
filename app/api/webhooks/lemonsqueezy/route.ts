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

        // Get email from payload - prefer user_email from attributes, fallback to meta
        const email = attributes.user_email || meta?.custom_data?.email;

        if (!email) {
            console.log(`[Webhook] No email found in payload for event ${eventType}`);
            return NextResponse.json({ message: 'No email found' }, { status: 200 });
        }

        console.log(`[Webhook] Received ${eventType} for ${email} (Status: ${attributes.status})`);

        // Handle Access Granting (Paid/Active)
        if (
            eventType === 'order_created' ||
            eventType === 'subscription_created' ||
            eventType === 'subscription_updated' ||
            eventType === 'subscription_payment_success'
        ) {
            if (attributes.status === 'paid' || attributes.status === 'active' || attributes.status === 'on_trial') {
                await prisma.user.update({
                    where: { email },
                    data: { plan: 'pro' }
                });
                console.log(`[Webhook] Upgraded user ${email} to pro`);
            }
        }

        // Handle Access Revocation (Refunded/Cancelled/Expired)
        if (
            eventType === 'subscription_cancelled' ||
            eventType === 'subscription_expired' ||
            eventType === 'order_refunded' ||
            eventType === 'subscription_payment_failed' // Optional: revoke on failed payment? Usually wait for 'past_due' or expiry.
        ) {
            // For cancellations, Lemon Squeezy sends 'subscription_cancelled' but status might still be 'active' until period end.
            // We should check 'ends_at' or rely on 'status' being 'cancelled'/'expired' if immediate.
            // However, 'order_refunded' is immediate revocation.

            const shouldRevoke =
                eventType === 'order_refunded' ||
                attributes.status === 'expired' ||
                attributes.status === 'void' ||
                attributes.status === 'refunded';

            if (shouldRevoke) {
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
