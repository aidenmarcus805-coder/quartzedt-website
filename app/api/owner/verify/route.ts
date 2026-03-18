import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { hash } = await req.json();

    if (!hash) {
      return NextResponse.json({ error: "Missing identity hash" }, { status: 400 });
    }

    // Single specific owner check via hash matching
    const owner = await (prisma as any).ownerFingerprint.findUnique({
      where: {
        hash: hash
      }
    });

    if (owner && owner.isOwner) {
      // Update last seen heartbeat implicitly
      await (prisma as any).ownerFingerprint.update({
        where: { id: owner.id },
        data: { lastSeen: new Date() }
      });

      return NextResponse.json({ isOwner: true });
    }

    return NextResponse.json({ isOwner: false, error: "Unauthorized Signature" }, { status: 401 });

  } catch (error) {
    console.error("Fingerprint API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
