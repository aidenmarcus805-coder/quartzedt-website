import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Minimal auth scaffold.
 *
 * NOTE: The Credentials provider below is intentionally permissive so the UI flows work in dev.
 * Replace `authorize()` with a real user lookup + password verification before production.
 */
export const authOptions: NextAuthOptions = {
  // IMPORTANT: Set NEXTAUTH_SECRET in production (Render/Vercel/etc.).
  // Fallback keeps local/dev working but is NOT safe for real users.
  secret: process.env.NEXTAUTH_SECRET || 'dev-unsafe-secret',
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@studio.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()?.toLowerCase();
        if (!email) return null;

        // TODO: Replace with real auth. For now, accept any email so the desktop connection flow can be built.
        return { id: email, email };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
};


