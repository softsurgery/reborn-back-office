import { JobStatus, ResponseJobDto } from "@/types";

export interface StateTransition {
  event: string;
  target: JobStatus;
  label: string;
  actor: "Client" | "Worker" | "System" | "Admin" | "Multiple";
  description: string;
}

export interface StateNodeConfig {
  id: JobStatus;
  title: string;
  category: "Drafting" | "Recruitment" | "Execution" | "Review & Payout" | "Terminal";
  description: string;
  actor: "Client" | "Worker" | "System" | "Admin" | "Multiple";
  iconName: string;
  transitions: StateTransition[];
  xstateMeta: {
    type: "atomic" | "final" | "compound";
    tags?: string[];
    onEntry?: string[];
    onExit?: string[];
  };
}

export type WorkflowNodeStatus = "completed" | "current" | "future" | "alternate";

// Primary chronological ordering for determining completed vs future steps
export const PRIMARY_WORKFLOW_ORDER: JobStatus[] = [
  JobStatus.DRAFT,
  JobStatus.POSTED,
  JobStatus.CANDIDATE_PENDING,
  JobStatus.NOT_STARTED,
  JobStatus.PENDING,
  JobStatus.FINISHED,
  JobStatus.REVIEWED_BY_WORKER,
  JobStatus.REVIEWED_BY_WORKER_AND_CLIENT,
  JobStatus.SUCCESSFUL,
];

export const getWorkflowNodeStatus = (
  targetStatus: JobStatus,
  currentJobStatus?: JobStatus
): WorkflowNodeStatus => {
  if (!currentJobStatus) return "future";
  if (targetStatus === currentJobStatus) return "current";

  const currentIndex = PRIMARY_WORKFLOW_ORDER.indexOf(currentJobStatus);
  const targetIndex = PRIMARY_WORKFLOW_ORDER.indexOf(targetStatus);

  if (targetStatus === JobStatus.FAILED) {
    return currentJobStatus === JobStatus.FAILED ? "current" : "alternate";
  }
  if (targetStatus === JobStatus.ON_HOLD) {
    return currentJobStatus === JobStatus.ON_HOLD ? "current" : "alternate";
  }
  if (targetStatus === JobStatus.ARCHIVED) {
    return currentJobStatus === JobStatus.ARCHIVED ? "current" : "alternate";
  }
  if (targetStatus === JobStatus.DELETED) {
    return currentJobStatus === JobStatus.DELETED ? "current" : "alternate";
  }

  if (currentIndex !== -1 && targetIndex !== -1) {
    if (targetIndex < currentIndex) return "completed";
    return "future";
  }

  return "alternate";
};

// Dynamically parse backend XState machine definition into StateNodeConfig dictionary
export const parseBackendMachineToStates = (
  machineConfig: any
): Record<JobStatus, StateNodeConfig> => {
  const result: Record<string, StateNodeConfig> = {};

  if (!machineConfig || !machineConfig.states) {
    return {} as Record<JobStatus, StateNodeConfig>;
  }

  const states = machineConfig.states;

  Object.keys(states).forEach((stateKey) => {
    const stateObj = states[stateKey] || {};
    const meta = stateObj.meta || {};
    const onObj = stateObj.on || {};

    const transitions: StateTransition[] = Object.keys(onObj).map((eventKey) => {
      const transObj = onObj[eventKey] || {};
      const transMeta = transObj.meta || {};
      return {
        event: eventKey,
        target: (transObj.target || stateKey) as JobStatus,
        label: transMeta.label || eventKey,
        actor: transMeta.actor || meta.actor || "Multiple",
        description: transMeta.description || `Transition via ${eventKey}`,
      };
    });

    result[stateKey] = {
      id: stateKey as JobStatus,
      title: meta.title || stateKey,
      category: meta.category || "Execution",
      description: meta.description || `Workflow step for ${stateKey}.`,
      actor: meta.actor || "Multiple",
      iconName: meta.iconName || "Layers",
      transitions,
      xstateMeta: {
        type: stateObj.type === "final" ? "final" : "atomic",
        tags: meta.tags || [stateKey.toLowerCase().replace(/[^a-z0-9]/g, "_")],
      },
    };
  });

  return result as Record<JobStatus, StateNodeConfig>;
};

// Format machine config as SCXML/JSON for developer inspection
export const formatXStateMachineJson = (machineConfig: any, job?: ResponseJobDto | null) => {
  if (!machineConfig) return JSON.stringify({ error: "No backend machine loaded yet" }, null, 2);
  return JSON.stringify(
    {
      id: machineConfig.id || `jobWorkflowMachine_${job?.id || "template"}`,
      initial: machineConfig.initial || job?.status || JobStatus.DRAFT,
      context: {
        jobId: job?.id || null,
        status: job?.status || machineConfig.initial || JobStatus.DRAFT,
      },
      states: machineConfig.states || {},
    },
    null,
    2
  );
};
