import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-1 border px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "border-foreground bg-foreground text-background",
        secondary: "border-border bg-muted text-foreground",
        destructive: "border-destructive bg-destructive text-background",
        outline: "border-border text-foreground",
        ghost: "border-transparent text-muted-foreground",
        link: "border-transparent p-0 text-foreground underline-offset-2 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
