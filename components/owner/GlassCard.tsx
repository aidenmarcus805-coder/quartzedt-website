import { cn } from "@/lib/utils";

/**
 * Formerly GlassCard, now repurposed as a minimal flat container.
 * Retains the name to prevent breaking imports across the app temporarily.
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
            "bg-white border border-slate-200 rounded-xl p-5 shadow-sm",
            hover && "transition-colors duration-150 hover:border-slate-300",
            className
        )}>
            {children}
        </div>
    );
};
