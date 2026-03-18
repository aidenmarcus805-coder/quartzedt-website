import { cn } from "@/lib/utils";

/**
 * Reusable Glassmorphism component providing Apple-esque high-end styling
 * backdrop-blur-md bg-white/80 border border-white/20 shadow-xl
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
            "backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6",
            hover && "transition-transform duration-150 hover:-translate-y-[2px]",
            className
        )}>
            {children}
        </div>
    );
};
