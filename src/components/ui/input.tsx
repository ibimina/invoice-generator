"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
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
Input.displayName = "Input";

export { Input };
