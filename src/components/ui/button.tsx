import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground",
        outline: "border-border bg-background text-foreground hover:bg-muted",
        secondary: "border-border bg-muted text-foreground hover:bg-accent",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
        destructive: "border-destructive bg-destructive text-background hover:opacity-90",
        link: "border-transparent p-0 text-foreground underline-offset-2 hover:underline",
      },
      size: {
        default: "h-9 px-3",
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
