'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function revokeDevice(deviceId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Ensure the device belongs to the user
    await prisma.desktopDevice.delete({
        where: {
            id: deviceId,
            userId: session.user.id,
        }
    });

    revalidatePath('/dashboard/downloads');
}
