import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'nav' | 'card'
}

export function GlassCard({ className, variant = 'card', children, ...props }: GlassCardProps) {
  const variantClass = {
    default: 'glass',
    nav: 'glass-nav',
    card: 'glass-card',
  }[variant]

  return (
    <div className={cn(variantClass, className)} {...props}>
      {children}
    </div>
  )
}
