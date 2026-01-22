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
            // Return empty so frontend uses fallback URL
            return NextResponse.json({ url: null });
        }

        // TODO: Call Creem API to create session when docs are available/key is present
        // const response = await fetch('https://api.creem.io/v1/checkout_sessions', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${CREEM_API_KEY}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         product_id: productId,
        //         email: session.user.email,
        //         success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
        //         cancel_url: `${process.env.NEXTAUTH_URL}/billing?checkout=cancel`,
        //     })
        // });
        // const data = await response.json();
        // return NextResponse.json({ url: data.checkout_url });

        return NextResponse.json({ url: null });

    } catch (error) {
        console.error('Checkout API error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
