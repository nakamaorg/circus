import type { VariantProps } from "class-variance-authority";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/helpers";



const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-base text-sm font-heading ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)]",
        destructive: "bg-destructive text-destructive-foreground shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)]",
        outline: "border-input bg-background shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)] hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neutral: "bg-background text-foreground shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)]",
        reverse: "bg-foreground text-background shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--border)]",
        noShadow: "bg-main text-main-foreground hover:bg-main/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-base px-3",
        lg: "h-11 rounded-base px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
