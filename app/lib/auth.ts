import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

/**
 * NextAuth configuration with Google OAuth and Prisma adapter.
 */
export const authOptions: NextAuthOptions = {
  // IMPORTANT: Set NEXTAUTH_SECRET in production (Render/Vercel/etc.)
  secret: process.env.NEXTAUTH_SECRET || 'dev-unsafe-secret',

  // Use Prisma adapter for database persistence
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Keep credentials for dev/testing
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@studio.com' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()?.toLowerCase();
        if (!email) return null;

        const turnstileToken = credentials?.turnstileToken;
        if (!turnstileToken) {
          throw new Error("Missing captcha token.");
        }

        const formData = new URLSearchParams();
        formData.append('secret', '0x4AAAAAACgT6K7hkQIgkfaxSu2b0rDjQQc.');
        formData.append('response', turnstileToken);

        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: formData,
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          throw new Error('Invalid captcha.');
        }

        // Find or create user in database
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: email.split('@')[0] },
          });
        }

        return { id: user.id, email: user.email, name: user.name, plan: user.plan || 'free' };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Add user ID and plan to token on sign in
      if (user) {
        token.userId = user.id;
        // Fetch plan from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true }
        });
        token.plan = dbUser?.plan || 'free';
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      // Add user ID and plan to session
      if (session.user && token.userId) {
        (session.user as { id?: string; plan?: string }).id = token.userId as string;
        (session.user as { id?: string; plan?: string }).plan = (token.plan as string) || 'free';
      }
      return session;
    },
  },

  pages: {
    signIn: '/signin',
    error: '/signin', // Redirect errors back to custom sign-in page
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Analytics hook could go here
      }
    },
  },
};
