import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('creem-signature');
        const rawBody = await req.text();
        const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('CREEM_WEBHOOK_SECRET is not set');
            return NextResponse.json({ message: 'Configuration error' }, { status: 500 });
        }

        if (!signature) {
            return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
        }

        // Verify signature
        // HMAC-SHA256 of the raw body using the secret
        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = hmac.update(rawBody).digest('hex');

        // Timing safe comparison to prevent timing attacks
        const signatureBuffer = Buffer.from(signature);
        const digestBuffer = Buffer.from(digest);

        // Ensure buffers are same length before comparing to avoid errors, 
        // though strictly they should be for a match.
        if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
            console.error('Invalid Creem webhook signature');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const { event_type, data } = body;

        console.log(`[Creem Webhook] Received ${event_type}`, data?.id);

        if (event_type === 'checkout.completed') {
            // "fields" contains the custom fields we sent, specifically "email"
            // "customer_details" might also have the email user entered
            const userEmail = data.fields?.email || data.customer_details?.email;

            if (userEmail) {
                console.log(`[Creem Webhook] Upgrading user ${userEmail} to pro`);

                await prisma.user.update({
                    where: { email: userEmail },
                    data: { plan: 'pro' }
                });
            } else {
                console.warn('[Creem Webhook] No email found in checkout.completed payload');
            }
        }

        // Handle subscription cancellations/activations if needed in future
        // Creem might have other events like subscription.updated or subscription.cancelled

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[Creem Webhook] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
