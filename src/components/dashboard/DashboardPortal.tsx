import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChartRadialLabel } from "./charts/ChartRadial";
import LineChartExample from "./charts/LineChart";
import { ChartPieSimple } from "./charts/PieChart";
import { ChartRadarLinesOnly } from "./charts/RadarChart";
import React from "react";

interface DashboardPortalProps {
  className?: string;
}

export const DashboardPortal: React.FC<DashboardPortalProps> = ({
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const tabs = [
    {
      value: "overview",
      label: "Vue d'ensemble",
      charts: [
        <ChartPieSimple key="pie" />,
        <LineChartExample key="line" />,
        <ChartRadialLabel key="radial" />,
        <ChartRadarLinesOnly key="radar" />,
      ],
    },
    {
      value: "performance",
      label: "Performance",
      charts: [
        <ChartRadialLabel key="radial" />,
        <LineChartExample key="line" />,
      ],
    },
    {
      value: "analytique",
      label: "Analytique",
      charts: [
        <ChartPieSimple key="pie" />,
        <ChartRadarLinesOnly key="radar" />,
      ],
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col flex-1 w-full px-4 pt-4 overflow-hidden container mx-auto",
        className
      )}
    >
      <Tabs
        defaultValue="overview"
        className="flex flex-col flex-1 w-full overflow-hidden"
      >
        <TabsList className="flex justify-center gap-4 mb-6 w-fit">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          if (tab.value === activeTab)
            return (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="flex flex-col flex-1 overflow-auto pb-4 no-scrollbar"
              >
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full max-w-full">
                  {tab.charts.map((Chart, i) => (
                    <React.Fragment key={i}>{Chart}</React.Fragment>
                  ))}
                </div>
              </TabsContent>
            );
        })}
      </Tabs>
    </div>
  );
};
