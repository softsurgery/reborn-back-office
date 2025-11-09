import React from "react"

export interface ChartTooltipContentProps {
  hideLabel?: boolean
  nameKey?: string   
}

export const ChartTooltipContent = ({ hideLabel, nameKey }: ChartTooltipContentProps) => {
  return (
    <div className="bg-white p-2 rounded shadow-md border border-gray-200 text-sm">
      {!hideLabel && nameKey}
    </div>
  )
}
