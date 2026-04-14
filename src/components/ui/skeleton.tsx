import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/50 dark:bg-slate-800/50 relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  )
}

export { Skeleton }
