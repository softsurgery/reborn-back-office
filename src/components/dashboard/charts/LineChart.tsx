"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import ChartCard from "./ChartCard"

const data = [
  { month: "Jan", uv: 400 },
  { month: "Feb", uv: 300 },
  { month: "Mar", uv: 200 },
]

export default function LineChartExample() {
  return (
    <ChartCard title="Line Chart">
      <div className="w-full max-w-[320px] h-[250px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
