import axios from "axios";
import { Feedback, ServerResponse } from "@/types";

const create = async (Feedback: Partial<Feedback>): Promise<ServerResponse<Feedback>> => {
  const response = await axios.post<ServerResponse<Feedback>>(
    "/api/client/feedbacks",
    Feedback
  );
  return response.data;
};

export const feedback = {
  // Feedbacks
  create,
};
