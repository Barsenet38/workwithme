import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 ${className}`}>
      {children}
    </div>
  );
}