import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This endpoint receives un-classified Markdown/Code outputs and routes them automatically to the right bucket.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { content, agentName, confidence, status, suggestedAction, tags } = data;

    if (!content || !agentName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Very simple determinisitc "AI Classifier" mapping logic based on tags provided by the Agent
    let pipelineSlug = "experiments"; // Default Fallback
    
    if (tags?.includes("code") || tags?.includes("tauri") || tags?.includes("diff")) {
        pipelineSlug = "code";
    } else if (tags?.includes("marketing") || tags?.includes("copy") || tags?.includes("seo")) {
        pipelineSlug = "marketing";
    } else if (tags?.includes("social") || tags?.includes("youtube") || tags?.includes("tiktok")) {
        pipelineSlug = "social";
    } else if (tags?.includes("jira") || tags?.includes("bug") || tags?.includes("product")) {
        pipelineSlug = "product";
    }

    // Fetch the correct Pipeline UUID from the string map provided above
    let pipeline = await prisma.pipeline.findUnique({
        where: { slug: pipelineSlug }
    });

    // If it literally doesn't exist, lazily spawn it.
    if (!pipeline) {
         pipeline = await prisma.pipeline.create({
             data: {
                 name: pipelineSlug.charAt(0).toUpperCase() + pipelineSlug.slice(1),
                 slug: pipelineSlug,
                 color: "blue" 
             }
         });
    }

    // We simulate a high predictive score natively here.
    const calculatedScore = Math.floor(confidence * (Math.random() * (1.2 - 0.8) + 0.8));
    
    // Output hits the feed natively
    const output = await prisma.clawOutput.create({
        data: {
            pipelineId: pipeline.id,
            content: content,
            agentName: agentName,
            confidence: confidence || 85,
            predictionScore: Math.min(100, Math.max(0, calculatedScore)),
            status: status || "DRAFT",
            suggestedAction: suggestedAction || "Review"
        }
    });

    return NextResponse.json({ success: true, pipeline: pipelineSlug, output });

  } catch (error) {
    console.error("Claw Output Ingestion API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
