import {
  OAuthPayload,
  ResponseSigninDto,
  ResponseSignupDto,
  SigninPayload,
  SignupPayload,
} from "@/types";
import axios from "./axios";

const signIn = async (payload: SigninPayload): Promise<ResponseSigninDto> => {
  const response = await axios.post<ResponseSigninDto>(
    "/auth/sign-in",
    payload
  );
  return response.data;
};

const signUp = async (payload: SignupPayload): Promise<ResponseSignupDto> => {
  const response = await axios.post("/auth/sign-up", payload);
  return response.data;
};

const oauth = async (payload: OAuthPayload): Promise<ResponseSigninDto> => {
  const response = await axios.post<ResponseSigninDto>("/auth/oauth", payload);
  return response.data;
};

const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `/auth/reset-password/${token}`,
    { password }
  );
  return response.data;
};

export const auth = {
  signIn,
  signUp,
  oauth,
  resetPassword,
};
