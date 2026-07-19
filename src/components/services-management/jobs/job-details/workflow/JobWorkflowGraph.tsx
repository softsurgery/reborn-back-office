import React from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import {
  StateNodeConfig,
  getWorkflowNodeStatus,
  PRIMARY_WORKFLOW_ORDER,
  parseBackendMachineToStates,
} from "./xstate-machine";

import { JobWorkflowNode } from "./JobWorkflowNode";
import { JobWorkflowInspector } from "./JobWorkflowInspector";
import { ResponseJobDto, JobStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

import {
  GitBranch,
  Target,
  Maximize2,
  Minimize2,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobWorkflowGraphProps {
  job?: ResponseJobDto | null;
  className?: string;
}

const nodeTypes = {
  jobWorkflowNode: JobWorkflowNode,
};

const NODE_WIDTH = 300;
const NODE_HEIGHT = 170;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "LR",
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: direction === "LR" ? 80 : 60,
    ranksep: direction === "LR" ? 120 : 100,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: direction === "LR" ? "left" : "top",
      sourcePosition: direction === "LR" ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    } as Node;
  });

  return { nodes: layoutedNodes, edges };
};

const FlowContent = ({ job, className }: JobWorkflowGraphProps) => {
  const reactFlowInstance = useReactFlow();
  const currentStatus = job?.status || JobStatus.DRAFT;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const toggleFullScreen = React.useCallback(() => {
    if (!isFullScreen) {
      setIsFullScreen(true);
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          (containerRef.current as any).msRequestFullscreen();
        }
      }
    } else {
      setIsFullScreen(false);
      const isNativeFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (isNativeFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    }
  }, [isFullScreen]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (!isNativeFullscreen && isFullScreen) {
        setIsFullScreen(false);
      } else if (isNativeFullscreen && !isFullScreen) {
        setIsFullScreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, [isFullScreen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        const isNativeFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );
        if (!isNativeFullscreen) {
          setIsFullScreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullScreen, reactFlowInstance]);

  const { data: machineConfig, isLoading: isMachineLoading } = useQuery({
    queryKey: ["job-workflow-machine"],
    queryFn: () => api.jobWorkflow.getMachine(),
  });

  const statesMap = React.useMemo(() => {
    return parseBackendMachineToStates(machineConfig);
  }, [machineConfig]);

  const { data: workflowInfo } = useQuery({
    queryKey: ["job-workflow", job?.id],
    queryFn: () => (job?.id ? api.jobWorkflow.findById(job.id) : null),
    enabled: !!job?.id,
  });

  const [direction, setDirection] = React.useState<"LR" | "TB">("LR");

  const [selectedConfig, setSelectedConfig] =
    React.useState<StateNodeConfig | null>(null);

  React.useEffect(() => {
    if (statesMap && Object.keys(statesMap).length > 0 && !selectedConfig) {
      setSelectedConfig(
        statesMap[currentStatus] || Object.values(statesMap)[0] || null,
      );
    }
  }, [statesMap, currentStatus, selectedConfig]);

  const [filterCategory, setFilterCategory] = React.useState<string>("all");

  // Build initial nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = React.useMemo(() => {
    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];

    const currentOrderIdx = PRIMARY_WORKFLOW_ORDER.indexOf(currentStatus);

    Object.values(statesMap).forEach((config) => {
      const status = getWorkflowNodeStatus(config.id, currentStatus);
      rawNodes.push({
        id: config.id,
        type: "jobWorkflowNode",
        data: {
          config,
          nodeStatus: status,
          isSelected: selectedConfig?.id === config.id,
          onSelectNode: (cfg: StateNodeConfig) => setSelectedConfig(cfg),
        },
        position: { x: 0, y: 0 },
      });

      config.transitions.forEach((trans, idx) => {
        const sourceStatus = getWorkflowNodeStatus(config.id, currentStatus);
        const targetStatus = getWorkflowNodeStatus(trans.target, currentStatus);

        const isCompletedEdge =
          sourceStatus === "completed" &&
          (targetStatus === "completed" || targetStatus === "current");
        const isCurrentEdge =
          sourceStatus === "current" && targetStatus === "current";

        rawEdges.push({
          id: `edge_${config.id}_${trans.target}_${trans.event}_${idx}`,
          source: config.id,
          target: trans.target,
          label: trans.label,
          animated:
            isCompletedEdge || isCurrentEdge || sourceStatus === "current",
          style: {
            strokeWidth: isCompletedEdge || sourceStatus === "current" ? 3 : 2,
            stroke:
              isCompletedEdge || isCurrentEdge
                ? "#10b981"
                : sourceStatus === "current"
                  ? "#a855f7"
                  : targetStatus === "alternate"
                    ? "#f59e0b"
                    : "#64748b",
            opacity: targetStatus === "alternate" ? 0.65 : 1,
          },
          labelStyle: {
            fill: "var(--foreground)",
            fontWeight: 700,
            fontSize: 11,
          },
          labelBgStyle: {
            fill: "var(--card)",
            fillOpacity: 0.9,
          },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 6,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color:
              isCompletedEdge || isCurrentEdge
                ? "#10b981"
                : sourceStatus === "current"
                  ? "#a855f7"
                  : targetStatus === "alternate"
                    ? "#f59e0b"
                    : "#64748b",
          },
        });
      });
    });

    return getLayoutedElements(rawNodes, rawEdges, direction);
  }, [currentStatus, direction, selectedConfig?.id, statesMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync selection across nodes when selectedConfig changes
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: selectedConfig?.id === n.id,
          onSelectNode: (cfg: StateNodeConfig) => setSelectedConfig(cfg),
        },
      })),
    );
  }, [selectedConfig, setNodes]);

  // Sync layout when direction or initial graph changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
    }, 50);
  }, [initialNodes, initialEdges, reactFlowInstance, setNodes, setEdges]);

  // Center on current status or selected node
  const handleCenterCurrent = React.useCallback(() => {
    const targetId = selectedConfig?.id || currentStatus;
    const targetNode = nodes.find((n) => n.id === targetId);
    if (targetNode && targetNode.position) {
      reactFlowInstance.setCenter(
        targetNode.position.x + NODE_WIDTH / 2,
        targetNode.position.y + NODE_HEIGHT / 2,
        { zoom: 1, duration: 500 },
      );
    } else {
      reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
    }
  }, [selectedConfig?.id, currentStatus, nodes, reactFlowInstance]);

  const handleSelectStateById = (status: JobStatus) => {
    const target = statesMap[status];
    if (target) {
      setSelectedConfig(target);
      const targetNode = nodes.find((n) => n.id === status);
      if (targetNode && targetNode.position) {
        reactFlowInstance.setCenter(
          targetNode.position.x + NODE_WIDTH / 2,
          targetNode.position.y + NODE_HEIGHT / 2,
          { zoom: 1, duration: 500 },
        );
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-1 w-full h-full min-h-[600px] relative rounded-3xl border border-border/60 overflow-hidden shadow-2xl bg-gradient-to-br from-background via-muted/10 to-background transition-all duration-300",
        className,
        isFullScreen &&
          "fixed inset-0 z-[100] !w-screen !h-screen !min-h-screen !rounded-none !border-none !shadow-none !m-0 !p-0",
      )}
    >
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        className="w-full h-full"
      >
        <Background
          color="#a855f7"
          gap={24}
          size={1.5}
          className="opacity-20"
        />
        <Controls
          className="!bg-card !border !border-border/60 !rounded-2xl !shadow-lg !p-1 !gap-1"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-card/90 !border !border-border/60 !rounded-2xl !shadow-lg overflow-hidden"
          nodeColor={(node) => {
            if (node.id === currentStatus) return "#a855f7";
            const st = (node.data as any)?.nodeStatus;
            if (st === "completed") return "#10b981";
            if (st === "alternate") return "#f59e0b";
            return "#64748b";
          }}
        />

        {/* Top Control Panel */}
        <Panel
          position="top-left"
          className="m-4 flex flex-wrap items-center gap-2 z-20"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border/60 shadow-lg text-xs font-bold">
            <GitBranch className="w-4 h-4 text-primary" />
            <span>Job Status:</span>
            <span className="px-2 py-0.5 rounded-lg bg-primary/15 text-primary font-black uppercase">
              {currentStatus}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCenterCurrent}
            className="rounded-2xl bg-card/95 backdrop-blur-md border-border/60 gap-1.5 text-xs font-bold shadow-lg hover:border-primary hover:text-primary transition-all"
          >
            <Target className="w-4 h-4 text-primary" /> Center Current Step
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDirection((d) => (d === "LR" ? "TB" : "LR"))}
            className="rounded-2xl bg-card/95 backdrop-blur-md border-border/60 gap-1.5 text-xs font-bold shadow-lg hover:border-primary transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-primary" />
            Layout: {direction === "LR" ? "Left-to-Right" : "Top-to-Bottom"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="rounded-2xl bg-card/95 backdrop-blur-md border-border/60 gap-1.5 text-xs font-bold shadow-lg hover:border-primary hover:text-primary transition-all"
            title={isFullScreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-primary" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-primary" />
                Fullscreen
              </>
            )}
          </Button>

          <Select
            value={selectedConfig?.id || ""}
            onValueChange={(val) => handleSelectStateById(val as JobStatus)}
          >
            <SelectTrigger className="w-48 h-8 rounded-2xl bg-card/95 backdrop-blur-md border-border/60 text-xs font-bold shadow-lg">
              <SelectValue placeholder="Jump to state..." />
            </SelectTrigger>
            <SelectContent className="max-h-64 rounded-2xl">
              {Object.values(statesMap).map((st) => (
                <SelectItem
                  key={st.id}
                  value={st.id}
                  className="text-xs font-semibold"
                >
                  {st.title} {st.id === currentStatus ? " (📍 Current)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Panel>
      </ReactFlow>

      {/* Right Side Inspector Drawer */}
      <JobWorkflowInspector
        selectedConfig={selectedConfig}
        currentJobStatus={currentStatus}
        job={job}
        workflowInfo={workflowInfo || null}
        machineConfig={machineConfig}
        statesMap={statesMap}
        onClose={() => setSelectedConfig(null)}
        onSelectStateById={handleSelectStateById}
      />
    </div>
  );
};

export const JobWorkflowGraph = (props: JobWorkflowGraphProps) => {
  return (
    <ReactFlowProvider>
      <FlowContent {...props} />
    </ReactFlowProvider>
  );
};
