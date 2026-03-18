import { redirect } from "next/navigation";

export default async function PipelineFeedPage({ params }: { params: Promise<{ pipeline: string }> }) {
    const { pipeline } = await params;
    redirect(`/dashboard/owner/pipelines/${pipeline}`);
}
