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
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
        ownerToneClassNames[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
