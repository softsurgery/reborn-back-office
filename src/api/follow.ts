import {
  ResponseFollowCountsDto,
  ResponseFollowDto,
  ResponseIsFollowingDto,
} from "@/types";
import axios from "./axios";

const findFollowers = async (id: string): Promise<ResponseFollowDto[]> => {
  const response = await axios.get(`/follow/${id}/followers`);
  return response.data;
};

const findFollowing = async (id: string): Promise<ResponseFollowDto[]> => {
  const response = await axios.get(`/follow/${id}/following`);
  return response.data;
};

const findDataCount = async (id: string): Promise<ResponseFollowCountsDto> => {
  const response = await axios.get(`/follow/${id}/data-count`);
  return response.data;
};

const followUser = async (id: string) => {
  const response = await axios.post(`/follow/${id}/follow`);
  return response.data;
};

const unfollowUser = async (id: string) => {
  const response = await axios.delete(`/follow/${id}/unfollow`);
  return response.data;
};

const findIsFollowing = async (id: string): Promise<ResponseIsFollowingDto> => {
  const response = await axios.get(`/follow/${id}/is-following`);
  return response.data;
};

export const follow = {
  followUser,
  unfollowUser,
  findFollowers,
  findFollowing,
  findDataCount,
  findIsFollowing,
};
