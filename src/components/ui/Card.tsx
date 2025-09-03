// c:/Users/yonas/Documents/HR/src/components/ui/Card.tsx
import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Define props with HTMLAttributes for flexibility
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6",
        className
      )}
      {...props} // Spread props to allow for more attributes (e.g., onClick)
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-0", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("p-0 pt-6", className)} {...props}>
      {children}
    </div>
  );
}