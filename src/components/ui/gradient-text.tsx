import { cn } from '@/lib/utils'

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'warm'
}

export function GradientText({ className, variant = 'emerald', children, ...props }: GradientTextProps) {
  const variantClass = {
    emerald: 'gradient-text',
    warm: 'gradient-text-warm',
  }[variant]

  return (
    <span className={cn(variantClass, className)} {...props}>
      {children}
    </span>
  )
}
