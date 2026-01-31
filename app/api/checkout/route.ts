import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { productId } = await req.json();

        // Check for API Key
        const CREEM_API_KEY = process.env.CREEM_API_KEY;
        if (!CREEM_API_KEY) {
            console.warn('CREEM_API_KEY not found in environment variables');
            return new NextResponse('Internal Error: Missing Payment Configuration', { status: 500 });
        }

        // Call Creem API to create session
        const response = await fetch('https://api.creem.io/v1/checkouts', {
            method: 'POST',
            headers: {
                'x-api-key': CREEM_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                customer: {
                    email: session.user.email,
                },
                success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
                cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=cancel`,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Creem API Error:', errorText);
            throw new Error(`Creem API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json({ url: data.checkout_url });

    } catch (error) {
        console.error('Checkout API error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
