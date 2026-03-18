import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");

  if (!channelId) {
    return new Response("Missing channelId", { status: 400 });
  }

  // Ensure channel exists so the UI doesn't crash on foreign key misses
  await prisma.clawChannel.upsert({
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
      
      const sendMessages = async () => {
        try {
          const queryArgs: any = {
            where: { channelId },
            orderBy: { createdAt: 'desc' }, // Get newest
            take: 20
          };
          
          const messages = await prisma.clawMessage.findMany(queryArgs);
          
          if (messages.length > 0) {
              const newestId = messages[0].id;
              if (newestId !== lastMessageId) {
                lastMessageId = newestId;
                // Re-reverse to send chronologically to UI
                const chunk = `data: ${JSON.stringify({ messages: messages.reverse() })}\n\n`;
                controller.enqueue(encoder.encode(chunk));
              }
          }
        } catch (e) {
           console.error("Claw Stream Error:", e);
        }
        
        // Fast polling fallback for the DB-driven chatter. 
        // In a true Redis/PubSub architecture this would be event-driven.
        setTimeout(sendMessages, 3000);
      };

      await sendMessages();

      req.signal.addEventListener('abort', () => {
        controller.close();
      });
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
