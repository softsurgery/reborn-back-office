import axios from "./axios";
import { ResponseJobWorkflowDto, UpdateJobStatusDto } from "@/types";

const findById = async (
  jobId: string,
  join = "uploads,uploads.upload"
): Promise<ResponseJobWorkflowDto> => {
  const response = await axios.get<ResponseJobWorkflowDto>(`/job-workflow/${jobId}`, {
    params: join ? { join } : undefined,
  });
  return response.data;
};

const next = async (
  jobId: string,
  event: string
): Promise<ResponseJobWorkflowDto> => {
  const payload: UpdateJobStatusDto = { event };
  const response = await axios.post<ResponseJobWorkflowDto>(`/job-workflow/${jobId}/next`, payload);
  return response.data;
};

const getMachine = async (): Promise<any> => {
  const response = await axios.get("/job-workflow/machine");
  return response.data;
};

export const jobWorkflow = {
  findById,
  next,
  getMachine,
};
