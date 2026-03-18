import type { OwnerTone } from '@/lib/owner/types';
import { ownerToneClassNames } from '@/lib/owner/present';
import { cn } from '@/lib/utils';

export function OwnerBadge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: OwnerTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        ownerToneClassNames[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
