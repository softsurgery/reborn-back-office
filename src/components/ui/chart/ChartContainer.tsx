import React from "react"

export interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
  }
}

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
  config?: ChartConfig
}

export function ChartContainer({ children, className, config }: ChartContainerProps) {
  return (
    <div className={`relative ${className ? className : ""}`}>
      {children}
    </div>
  )
}
