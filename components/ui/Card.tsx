import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'strong'
  glow?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glow = false,
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-dark-900 border border-dark-700',
    glass: 'glass',
    strong: 'glass-strong',
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6',
        variants[variant],
        glow && 'shadow-glow-orange',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

