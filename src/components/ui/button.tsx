"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
                outline:
                    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-500",
                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500",
                ghost:
                    "text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500",
                link: "text-slate-900 underline-offset-4 hover:underline",
                success:
                    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
