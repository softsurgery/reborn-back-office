import axios from "./axios";

export const test = async (id: string) => {
  const response = await axios.post(`/notification/test/${id}`);
  return response.data;
};

export const notification = {
  test,
};
