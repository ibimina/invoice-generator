"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors resize-y",
                    "placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-200",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
