import { cn } from '@/lib/utils'

type StaggerContainerProps = React.HTMLAttributes<HTMLDivElement>

export function StaggerContainer({ className, children, ...props }: StaggerContainerProps) {
  return (
    <div className={cn('stagger-children', className)} {...props}>
      {children}
    </div>
  )
}
