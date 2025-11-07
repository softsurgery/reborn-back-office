import React from "react"

interface ChartTooltipProps {
  cursor?: boolean | object
  content?: React.ReactNode
}

export function ChartTooltip({ cursor, content }: ChartTooltipProps) {
  // Pour simplifier, on affiche directement le content
  return <>{content}</>
}
