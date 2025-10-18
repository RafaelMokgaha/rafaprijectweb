import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

// SectionWrapper
type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const SectionWrapper = React.forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ children, className, id, ...props }, ref) => {
    return (
      <section 
        ref={ref} 
        id={id} 
        className={cn(
          "my-16 md:my-24 py-12 px-4 sm:px-6 md:px-10 rounded-2xl bg-black/20 backdrop-blur-md border border-primary/10 shadow-lg shadow-black/30", 
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);
SectionWrapper.displayName = 'SectionWrapper';

// SectionTitle
interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 className={cn(
      "text-4xl md:text-5xl font-headline font-bold text-center mb-10 md:mb-12 uppercase tracking-wider text-shadow-glow",
      className
    )}>
      {children}
    </h2>
  );
}

export { SectionWrapper, SectionTitle };
