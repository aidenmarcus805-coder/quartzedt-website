import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { isOwnerEmail } from "@/lib/owner/config";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isOwnerEmail(session?.user?.email)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const pipelineId = formData.get("pipelineId") as string;
    const slug = formData.get("slug") as string;

    if (!pipelineId) return new Response("Missing pipelineId", { status: 400 });

    const samples = [
        {
            content: "KiloClaw detected anomalous scaling in wedding ingest latency (+12%). Auto-scaling cluster nodes on Render... NODE_42 deployed.",
            agentName: "Swarm Watcher v1.1",
            confidence: 98,
            predictionScore: 88,
            status: "ACTION_NEEDED",
            suggestedAction: "View Cluster Health"
        },
        {
            content: "Marketing Copy Generation: 'Studio-grade assembly for high-volume editors.' A/B testing variations now live in Social feed.",
            agentName: "Content Fleet v4",
            confidence: 85,
            predictionScore: 72,
            status: "DRAFT",
            suggestedAction: "Approve for X"
        },
        {
            content: "Code Spec: Refactored redundant Prisma instances in SSE streams. Verified connection stability on 128 concurrent streams.",
            agentName: "Code Auditor v3",
            confidence: 100,
            predictionScore: 95,
            status: "APPROVED",
            suggestedAction: "Deploy to Main"
        }
    ];

    await Promise.all(samples.map(s => 
        (prisma as any).clawOutput.create({
            data: {
                ...s,
                pipelineId
            }
        })
    ));

    redirect(`/dashboard/owner/${slug}`);
}
