import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted",
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  alt,
  className,
  src,
  ...props
}: React.ComponentProps<"div"> & { src?: string; alt?: string }) {
  return (
    <div
      data-slot="avatar-image"
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={cn(
        "relative z-10 aspect-square size-full bg-cover bg-center bg-no-repeat",
        className,
      )}
      style={src ? { backgroundImage: `url(${src})` } : undefined}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "absolute inset-0 flex size-full items-center justify-center bg-secondary text-sm font-medium text-secondary-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
