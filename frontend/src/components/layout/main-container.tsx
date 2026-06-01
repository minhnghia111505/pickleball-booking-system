import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface MainContainerProps {
  children: ReactNode;
  className?: string;
}

export function MainContainer({ children, className }: MainContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
