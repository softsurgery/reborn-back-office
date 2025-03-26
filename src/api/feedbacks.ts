import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Feedback } from "@/types/feedback";

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  sort: string,
  filter: string = "",
  fields: string[] = [],
  join: string[] = []
): Promise<Paginated<Feedback>> => {
  const response = await axios.get<Paginated<Feedback>>(
    `/api/feedbacks/list?`,
    {
      params: {
        page,
        size,
        sort,
        filter,
        fields: fields ? fields.join(",") : "",
        join: join ? join.join(",") : "",
      },
    }
  );
  return response.data;
};

const findAll = async (): Promise<Feedback[]> => {
  const response = await axios.get<Feedback[]>(`/api/feedbacks`);
  return response.data;
};

const findById = async (feedbackId: number): Promise<Feedback> => {
  const response = await axios.get<Feedback>(`/api/feedbacks/${feedbackId}`);
  return response.data;
};

const create = async (Feedback: Partial<Feedback>): Promise<Feedback> => {
  const response = await axios.post<Feedback>("/api/feedbacks", Feedback);
  return response.data;
};

const update = async (
  feedbackId: number,
  Feedback: Partial<Feedback>
): Promise<Feedback> => {
  const response = await axios.put<Feedback>(
    `/api/feedbacks/${feedbackId}`,
    Feedback
  );
  return response.data;
};

const remove = async (feedbackId: number): Promise<void> => {
  await axios.delete(`/api/feedbacks/${feedbackId}`);
};

export const feedback = {
  // Feedbacks
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
