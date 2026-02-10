import {
  ResponseEducationDto,
  CreateEducationDto,
  UpdateEducationDto,
} from "@/types";
import axios from "../axios";

// GET /education/user/:userId
const findAllByUser = async (
  userId: string,
): Promise<ResponseEducationDto[]> => {
  const response = await axios.get<ResponseEducationDto[]>(
    `/education/user/${userId}`,
  );
  return response.data;
};

// POST /education/user/:userId
const create = async (
  userId: string,
  education: CreateEducationDto,
): Promise<ResponseEducationDto> => {
  const response = await axios.post(`/education/user/${userId}`, education);
  return response.data;
};

// PUT /education/:id (id is number)
const update = async (
  id: string,
  education: UpdateEducationDto,
): Promise<ResponseEducationDto> => {
  const response = await axios.put(`/education/${id}`, education);
  return response.data;
};

// DELETE /education/:id (id is number)
const remove = async (id: string): Promise<ResponseEducationDto> => {
  const response = await axios.delete(`/education/${id}`);
  return response.data;
};

export const education = {
  findAllByUser,
  create,
  update,
  remove,
};
