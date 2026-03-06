import * as React from "react"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name?: string | null
  size?: "sm" | "md" | "lg"
}

function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  if (src) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", sizeClasses[size], className)} {...props}>
        <img src={src} alt={name || ""} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {name ? getInitials(name) : "?"}
    </div>
  )
}

export { Avatar }
