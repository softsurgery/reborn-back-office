import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  FileEdit,
  Globe,
  UserCheck,
  Clock,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  MessageSquare,
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StateNodeConfig, WorkflowNodeStatus } from "./xstate-machine";

export interface JobWorkflowNodeData {
  config: StateNodeConfig;
  nodeStatus: WorkflowNodeStatus;
  isSelected: boolean;
  onSelectNode: (config: StateNodeConfig) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  FileEdit,
  Globe,
  UserCheck,
  Clock,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  MessageSquareCheck: MessageSquare,
  Award,
  CheckCircle2,
  XCircle,
};

export const JobWorkflowNode = ({ data }: NodeProps) => {
  const { config, nodeStatus, isSelected, onSelectNode } = data as unknown as JobWorkflowNodeData;
  const IconComponent = iconMap[config.iconName] || Zap;

  const statusBadgeMap: Record<
    WorkflowNodeStatus,
    { label: string; className: string; glow?: boolean }
  > = {
    current: {
      label: "📍 CURRENT STEP",
      className: "bg-primary text-primary-foreground font-black tracking-wider animate-pulse shadow-sm",
      glow: true,
    },
    completed: {
      label: "✓ COMPLETED",
      className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30",
    },
    future: {
      label: "⏳ UPCOMING",
      className: "bg-muted text-muted-foreground font-semibold border border-border/50",
    },
    alternate: {
      label: "⚡ ALTERNATE PATH",
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30",
    },
  };

  const badgeInfo = statusBadgeMap[nodeStatus];

  const categoryColorMap: Record<string, string> = {
    Drafting: "border-l-blue-500 text-blue-500",
    Recruitment: "border-l-indigo-500 text-indigo-500",
    Execution: "border-l-purple-500 text-purple-500",
    "Review & Payout": "border-l-pink-500 text-pink-500",
    Terminal: "border-l-emerald-500 text-emerald-500",
  };

  return (
    <div
      onClick={() => onSelectNode(config)}
      className={cn(
        "relative group w-72 rounded-2xl border-2 transition-all duration-300 select-none cursor-pointer overflow-hidden backdrop-blur-md",
        "bg-card/95 hover:bg-card shadow-lg hover:shadow-2xl hover:-translate-y-0.5",
        // Status specific styling
        nodeStatus === "current" &&
          "border-primary ring-4 ring-primary/25 shadow-[0_0_25px_rgba(168,85,247,0.45)] scale-105 z-20",
        nodeStatus === "completed" &&
          "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20",
        nodeStatus === "future" && "border-border/60 opacity-90 hover:opacity-100",
        nodeStatus === "alternate" &&
          "border-dashed border-amber-500/40 bg-amber-500/5 opacity-75 hover:opacity-100",
        // Selection highlight
        isSelected && "border-primary ring-2 ring-primary shadow-xl"
      )}
    >
      {/* Top Handle for vertical/hierarchical layouts */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background transition-transform group-hover:scale-125"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-primary !border-2 !border-background transition-transform group-hover:scale-125"
      />

      {/* Node Header Banner */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50 bg-muted/30">
        <span
          className={cn(
            "text-[10px] uppercase px-2 py-0.5 rounded-full border border-border/40 font-black tracking-wider",
            badgeInfo.className
          )}
        >
          {badgeInfo.label}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span>{config.actor}</span>
        </div>
      </div>

      {/* Node Body */}
      <div
        className={cn(
          "p-4 border-l-4 flex flex-col gap-2",
          categoryColorMap[config.category] || "border-l-primary"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-inner",
              nodeStatus === "current"
                ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-primary/30"
                : nodeStatus === "completed"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-foreground"
            )}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="font-extrabold text-sm leading-tight truncate text-foreground">
              {config.title}
            </h4>
            <span className="text-[11px] font-semibold text-muted-foreground truncate mt-0.5">
              {config.category}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed mt-1">
          {config.description}
        </p>

        {/* Transition indicator footer inside node */}
        {config.transitions.length > 0 && (
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-border/40 text-[11px] font-bold text-primary/90">
            <span>Next Transitions:</span>
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-black">
              {config.transitions.length}
            </span>
          </div>
        )}
      </div>

      {/* Bottom & Right Handles for connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background transition-transform group-hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-primary !border-2 !border-background transition-transform group-hover:scale-125"
      />
    </div>
  );
};
