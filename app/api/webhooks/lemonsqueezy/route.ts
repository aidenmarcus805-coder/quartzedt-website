import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '');
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(text);
        const { meta, data } = payload;

        if (meta.event_name === 'order_created') {
            const email = data.attributes.user_email;
            // You might also want to check product_id or variant_id if you have multiple products
            // const variantId = data.attributes.first_order_item.variant_id;

            if (email) {
                console.log(`Processing order for ${email}`);

                // Upsert user: Update if exists, create if not (so they have Pro when they eventually sign up)
                await prisma.user.upsert({
                    where: { email },
                    update: { plan: 'pro' },
                    create: {
                        email,
                        plan: 'pro',
                        // created via webhook
                    },
                });
            }
        }

        return new NextResponse('Webhook received', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
