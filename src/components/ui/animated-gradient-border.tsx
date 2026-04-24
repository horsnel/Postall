import { cn } from '@/lib/utils'

interface AnimatedGradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AnimatedGradientBorder({ className, children, ...props }: AnimatedGradientBorderProps) {
  return (
    <div className={cn('gradient-border', className)} {...props}>
      {children}
    </div>
  )
}
