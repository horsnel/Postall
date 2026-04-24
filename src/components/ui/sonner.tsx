"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "oklch(1 0 0)",
          "--normal-text": "oklch(0.13 0.01 155)",
          "--normal-border": "oklch(0.88 0.007 95)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
