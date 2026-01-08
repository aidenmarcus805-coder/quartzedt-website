This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment variables (production)

Set these in your host (Render/Vercel/etc.):

- **NextAuth**
  - `NEXTAUTH_URL`: your deployed site URL (e.g. `https://your-app.onrender.com`)
  - `NEXTAUTH_SECRET`: a long random secret string
- **Desktop app integration**
  - `NEXT_PUBLIC_DESKTOP_SCHEME`: custom URL scheme your desktop app registers (e.g. `quartz`)
  - `NEXT_PUBLIC_DESKTOP_DOWNLOAD_MAC_URL`: macOS installer download URL (optional; shows “Coming soon” if empty)
  - `NEXT_PUBLIC_DESKTOP_DOWNLOAD_WINDOWS_URL`: Windows installer download URL (optional; shows “Coming soon” if empty)
- **Book demo (optional)**
  - `NEXT_PUBLIC_BOOK_DEMO_URL`: a URL like Calendly (preferred)
  - `NEXT_PUBLIC_BOOK_DEMO_EMAIL`: fallback email for `mailto:` if no URL is set

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
