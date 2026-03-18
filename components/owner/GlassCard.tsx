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
            "rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/72",
            hover && "transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_30px_70px_-34px_rgba(15,23,42,0.22)]",
            className
        )}>
            {children}
        </div>
    );
};
