import axios from "axios";

const forgetPassword = async (emailOrUsername: string) => {
  const response = await axios.post("/api/auth/forgot-password", {
    emailOrUsername,
  });
  return response.data;
};

const resetPassword = async (token: string, password: string) => {
  const response = await axios.post("/api/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

export const auth = {
  forgetPassword,
  resetPassword,
};
