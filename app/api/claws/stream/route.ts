import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { isOwnerEmail } from "@/lib/owner/config";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !isOwnerEmail(session.user?.email)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");

  if (!channelId) {
    return new Response("Missing channelId", { status: 400 });
  }

  // Ensure channel exists so the UI doesn't crash on foreign key misses
  await (prisma as any).clawChannel.upsert({
      where: { name: channelId },
      update: {},
      create: {
          name: channelId,
          description: "Auto-provisioned channel",
          id: channelId
      }
  });

  const stream = new ReadableStream({
    async start(controller) {
      let lastMessageId: string | null = null;
      
      let isActive = true;
      req.signal.addEventListener('abort', () => {
        isActive = false;
        controller.close();
      });

      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      try {
        while (isActive) {
          const messages = await (prisma as any).clawMessage.findMany({
            where: { channelId },
            orderBy: { createdAt: 'desc' },
            take: 20
          });
          
          if (messages.length > 0) {
              const newestId = messages[0].id;
              if (newestId !== lastMessageId) {
                lastMessageId = newestId;
                const chunk = `data: ${JSON.stringify({ messages: messages.reverse() })}\n\n`;
                controller.enqueue(encoder.encode(chunk));
              }
          }
          
          await delay(3000);
        }
      } catch (e) {
        console.error("Claw Stream Error:", e);
        if (isActive) controller.error(e);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
