// api/experience.ts (mirroring user.ts pattern)
import {
  ResponseExperienceDto,
  CreateExperienceDto,
  UpdateExperienceDto,
} from "@/types";
import axios from "../axios";

// GET /experience/user/:userId
const findAllByUser = async (
  userId: string,
): Promise<ResponseExperienceDto[]> => {
  const response = await axios.get<ResponseExperienceDto[]>(
    `/experience/user/${userId}`,
  );
  return response.data;
};

// POST /experience/user/:userId
const create = async (
  userId: string,
  experience: CreateExperienceDto,
): Promise<ResponseExperienceDto> => {
  const response = await axios.post(`/experience/user/${userId}`, experience);
  return response.data;
};

// PUT /experience/:id (id is number)
const update = async (
  id: number,
  experience: UpdateExperienceDto,
): Promise<ResponseExperienceDto> => {
  const response = await axios.put(`/experience/${id}`, experience);
  return response.data;
};

// DELETE /experience/:id (id is number)
const remove = async (id: number): Promise<ResponseExperienceDto> => {
  const response = await axios.delete(`/experience/${id}`);
  return response.data;
};

export const experience = {
  findAllByUser,
  create,
  update,
  remove,
};
