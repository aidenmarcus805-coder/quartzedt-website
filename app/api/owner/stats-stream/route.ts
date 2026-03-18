import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { isOwnerEmail } from "@/lib/owner/config";

// Keep the Edge runtime running if needed, or stick to Node for Prisma
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !isOwnerEmail(session.user?.email)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  // Create highly efficient ReadableStream for real-time pushing
  const stream = new ReadableStream({
    async start(controller) {
      // Persistent loop for pushing data
      let isActive = true;
      req.signal.addEventListener('abort', () => {
        isActive = false;
        controller.close();
      });

      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      const sendEvent = (data: any) => {
        const chunk = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      };

      try {
        while (isActive) {
          const waitlistCount = await prisma.waitlist.count();
          const waitlistToday = await prisma.waitlist.count({
            where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
          });

          const activeDevicesCount = await prisma.desktopDevice.count({
            where: { lastSeen: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
          });

          const MRR = 2847; // TODO: Pull from Stripe/Payments
          const activeProjects = await (prisma as any).project.aggregate({
            _sum: { weddingsCount: true, timeSavedHrs: true }
          });

          sendEvent({
            waitlist: { current: waitlistCount, trend: `+${waitlistToday} today` },
            licenses: { current: activeDevicesCount, mapActive: true },
            mrr: { current: `$${MRR.toLocaleString()}`, trend: `+18%` },
            projects: { 
              current: `${activeProjects._sum.weddingsCount || 0} processed`, 
              saved: `${activeProjects._sum.timeSavedHrs?.toFixed(1) || 0}h` 
            }
          });

          // Wait 10 seconds before next push
          await delay(10000);
        }
      } catch (e) {
        console.error("SSE Stat fetch error:", e);
        if (isActive) controller.error(e);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
