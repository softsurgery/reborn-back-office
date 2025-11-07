"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Données du graphique
const chartData = [
  { browser: "chrome", visitors: 275, fill: "#f87171" }, // rouge
  { browser: "safari", visitors: 200, fill: "#60a5fa" }, // bleu
  { browser: "firefox", visitors: 187, fill: "#34d399" }, // vert
  { browser: "edge", visitors: 173, fill: "#facc15" }, // jaune
  { browser: "other", visitors: 90, fill: "#a78bfa" }, // violet
]

export function ChartPieSimple() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center pb-0">
        {/* ✅ Taille uniforme et responsive */}
        <ChartContainer className="w-full max-w-[320px] h-[250px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                outerRadius="90%"
                innerRadius="50%"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel={false} />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
