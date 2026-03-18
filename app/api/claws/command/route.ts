import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { channelId, content } = await req.json();

    if (!channelId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure channel exists
    await prisma.clawChannel.upsert({
         where: { name: channelId },
         update: {},
         create: {
             name: channelId,
             description: "Auto-provisioned channel",
             id: channelId
         }
    });

    // Capture the Owner's input
    await prisma.clawMessage.create({
      data: {
        channelId,
        content,
        agentName: 'Owner',
        isOwner: true,
      }
    });

    // -----------------------------------------------------
    // SIMULATED SWARM REACTION DELAY (Up to 8s)
    // -----------------------------------------------------
    let autoResponseContent = "";
    let autoResponseAgentName = "";

    const lowerInput = content.toLowerCase();

    // Primitive local parse tree acting as the LLM Swarm Router
    if (lowerInput.includes('/deploy') || lowerInput.includes('code')) {
        autoResponseAgentName = "Code Agent (Alpha)";
        autoResponseContent = "Acknowledged. Initiating build sequence and semantic caching deployment.";
    } else if (lowerInput.includes('priority social') || lowerInput.includes('marketing')) {
        autoResponseAgentName = "Social Fleet";
        autoResponseContent = "Realigning output. Pushing recent TikTok drafts to highest priority index in DB.";
    } else if (lowerInput.includes('status')) {
         autoResponseAgentName = "System Overlord";
         autoResponseContent = "All 12 agents operational. GPU VRAM utilization nominal at 42%.";
    } else {
        autoResponseAgentName = "KiloClaw Prime";
        autoResponseContent = `Interpreting intent for "${content.substring(0, 15)}...". Awaiting further context.`;
    }

    // Trigger fake "Agent Typing" delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

    // Agent Responds implicitly into the stream
    const agentMessage = await prisma.clawMessage.create({
        data: {
            channelId,
            content: autoResponseContent,
            agentName: autoResponseAgentName,
            isOwner: false
        }
    });

    return NextResponse.json({ success: true, message: agentMessage });

  } catch (error) {
    console.error("Claw Command API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
