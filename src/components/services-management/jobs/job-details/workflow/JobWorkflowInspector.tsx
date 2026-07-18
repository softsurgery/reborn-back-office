import React from "react";
import {
  StateNodeConfig,
  WorkflowNodeStatus,
  formatXStateMachineJson,
} from "./xstate-machine";

import { ResponseJobDto, JobStatus, ResponseJobWorkflowDto } from "@/types";
import { Button } from "@/components/ui/button";
import {
  X,
  ArrowRight,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Sparkles,
  Layers,
  HelpCircle,
  Zap,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface JobWorkflowInspectorProps {
  selectedConfig: StateNodeConfig | null;
  currentJobStatus?: JobStatus;
  job?: ResponseJobDto | null;
  workflowInfo?: ResponseJobWorkflowDto | null;
  machineConfig?: any;
  statesMap?: Record<JobStatus, StateNodeConfig>;
  onClose: () => void;
  onSelectStateById: (status: JobStatus) => void;
}

export const JobWorkflowInspector = ({
  selectedConfig,
  currentJobStatus,
  job,
  workflowInfo,
  machineConfig,
  statesMap,
  onClose,
  onSelectStateById,
}: JobWorkflowInspectorProps) => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = React.useState(false);
  const [inspectorTab, setInspectorTab] = React.useState<"overview" | "xstate">(
    "overview",
  );

  const transitionMutation = useMutation({
    mutationFn: (event: string) => api.jobWorkflow.next(job!.id, event),
    onSuccess: (data) => {
      toast.success(`Job transitioned to ${data.status} via backend!`);
      queryClient.invalidateQueries({ queryKey: ["job-workflow", job?.id] });
      queryClient.invalidateQueries({ queryKey: ["job", job?.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (data.status) {
        onSelectStateById(data.status as JobStatus);
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to trigger backend workflow step.",
      );
    },
  });

  if (!selectedConfig) return null;

  const nodeStatus: WorkflowNodeStatus =
    selectedConfig.id === currentJobStatus
      ? "current"
      : selectedConfig.id === JobStatus.SUCCESSFUL ||
          selectedConfig.id === JobStatus.FAILED
        ? currentJobStatus === selectedConfig.id
          ? "current"
          : "alternate"
        : "future"; // Simplified check for display header

  const statusLabelMap: Record<string, { text: string; badgeClass: string }> = {
    current: {
      text: "📍 Current Active Step",
      badgeClass: "bg-primary text-primary-foreground animate-pulse",
    },
    completed: {
      text: "✓ Completed Step",
      badgeClass: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    },
    future: {
      text: "⏳ Future Potential Step",
      badgeClass: "bg-muted text-muted-foreground",
    },
    alternate: {
      text: "⚡ Alternate Branch / Path",
      badgeClass: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    },
  };

  const statusInfo = statusLabelMap[nodeStatus] || statusLabelMap.future;

  const handleCopyXState = () => {
    const json = formatXStateMachineJson(machineConfig, job);
    navigator.clipboard.writeText(json);
    setCopied(true);
    toast.success("XState Machine JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border/60 shadow-2xl z-30 animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-extrabold text-base tracking-tight">
            Workflow State Inspector
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-full hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* State Title Card */}
      <div className="p-5 border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-black tracking-wide",
              statusInfo.badgeClass,
            )}
          >
            {statusInfo.text}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
            {selectedConfig.category}
          </span>
        </div>

        <h2 className="text-xl font-black text-foreground tracking-tight mt-1">
          {selectedConfig.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {selectedConfig.description}
        </p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>
              Actor:{" "}
              <strong className="text-primary">{selectedConfig.actor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Terminal className="w-4 h-4 text-purple-500" />
            <span>
              Type:{" "}
              <strong className="uppercase text-purple-500">
                {selectedConfig.xstateMeta.type}
              </strong>
            </span>
          </div>
          {workflowInfo && selectedConfig.id === currentJobStatus && (
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>
                Backend:{" "}
                <strong
                  className={
                    workflowInfo.isUpdatable
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }
                >
                  {workflowInfo.isUpdatable ? "Updatable" : "Locked"}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs between Overview / Transitions and XState Configuration */}
      <Tabs
        value={inspectorTab}
        onValueChange={(val) => setInspectorTab(val as any)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="px-4 pt-3 border-b border-border/60 bg-muted/20">
          <TabsList className="grid grid-cols-2 w-full h-9 p-1 bg-muted/80 rounded-xl">
            <TabsTrigger
              value="overview"
              className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Next Transitions
            </TabsTrigger>
            <TabsTrigger
              value="xstate"
              className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5" /> XState Machine
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview & Transitions Tab */}
        <TabsContent
          value="overview"
          className="flex-1 overflow-y-auto p-4 space-y-5 m-0 focus-visible:outline-none"
        >
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <span>Possible Outgoing Transitions</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-black">
                {selectedConfig.transitions.length}
              </span>
            </h4>

            {selectedConfig.transitions.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-border/60 bg-muted/30 text-center space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  This is a terminal or final state. No further transitions
                  exist from here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedConfig.transitions.map((trans, idx) => {
                  const targetState = statesMap
                    ? statesMap[trans.target]
                    : null;
                  return (
                    <div
                      key={idx}
                      className="group p-3.5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-md transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wide">
                          EVENT: {trans.event}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground">
                          Actor: {trans.actor}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 font-bold text-sm text-foreground">
                        <span>{trans.label}</span>
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 transition-transform group-hover:translate-x-1" />
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {trans.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-border/40 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground">
                            Target:
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectStateById(trans.target)}
                            className="h-7 px-2.5 rounded-lg text-xs font-bold gap-1 hover:border-primary hover:text-primary"
                          >
                            <span>{targetState?.title || trans.target}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>

                        {selectedConfig.id === currentJobStatus &&
                          job?.id &&
                          workflowInfo?.nextSteps?.some(
                            (s) =>
                              s.label.toLowerCase() ===
                              trans.event.toLowerCase(),
                          ) && (
                            <Button
                              variant="default"
                              size="sm"
                              disabled={transitionMutation.isPending}
                              onClick={() =>
                                transitionMutation.mutate(trans.event)
                              }
                              className="h-7 px-3 rounded-lg text-xs font-bold gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                              <span>Execute Backend ({trans.event})</span>
                            </Button>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* XState Metadata summary */}
          <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-2">
            <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" /> XState Hooks &
              Tags
            </h5>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedConfig.xstateMeta.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {selectedConfig.xstateMeta.onEntry && (
              <div className="pt-2 text-xs text-muted-foreground font-mono">
                <strong className="text-foreground">onEntry:</strong>{" "}
                {selectedConfig.xstateMeta.onEntry.join(", ")}
              </div>
            )}
          </div>
        </TabsContent>

        {/* XState Machine JSON Tab */}
        <TabsContent
          value="xstate"
          className="flex-1 overflow-y-auto p-4 space-y-4 m-0 focus-visible:outline-none"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-foreground">
                SCXML / XState v5 Definition
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Complete reactive state machine specification for this job.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyXState}
              className="h-8 px-3 rounded-xl gap-1.5 text-xs font-bold shadow-2xs hover:border-primary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy JSON
                </>
              )}
            </Button>
          </div>

          <div className="relative rounded-2xl border border-border/60 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
            <pre className="leading-relaxed">
              {formatXStateMachineJson(machineConfig, job)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
