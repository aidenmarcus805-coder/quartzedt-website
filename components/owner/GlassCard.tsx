import { cn } from "@/lib/utils";

/**
 * Shared owner dashboard container with a soft glass treatment.
 */
export const GlassCard = ({
    children,
    className,
    hover = true
}: {
    children: React.ReactNode,
    className?: string,
    hover?: boolean
}) => {
    return (
        <div className={cn(
            "rounded-lg border border-slate-200 bg-white shadow-sm",
            hover && "transition duration-200 hover:border-slate-300",
            className
        )}>
            {children}
        </div>
    );
};
