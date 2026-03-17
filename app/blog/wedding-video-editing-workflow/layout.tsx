import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Ultimate Wedding Video Editing Workflow: 2026 Guide | Quartz',
    description: 'Learn how to speed up wedding video editing and cut from raw cards to delivery in half the time. A complete workflow guide from ingest to final export.',
    openGraph: {
        title: 'The Ultimate Wedding Video Editing Workflow: 2026 Guide',
        description: 'Learn how to speed up wedding video editing and cut from raw cards to delivery in half the time',
        type: 'article',
    }
};

export default function WeddingWorkflowLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
