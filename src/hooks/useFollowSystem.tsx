import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "@/api";

interface useFollowSystemProps {
  id: string;
  use?: ("is-following" | "followers" | "followings")[];
  follow?: {
    onSuccess?: (data?: any, variables?: void, context?: any) => void;
    onError?: (error?: any, variables?: void, context?: any) => void;
  };
  unfollow?: {
    onSuccess?: (data?: any, variables?: void, context?: any) => void;
    onError?: (error?: any, variables?: void, context?: any) => void;
  };
}

export function useFollowSystem({
  id,
  use = [],
  follow,
  unfollow,
}: useFollowSystemProps) {
  const {
    data: isFollowingResp,
    isPending: isIsFollowingPending,
    refetch: refetchIsFollowing,
  } = useQuery({
    queryKey: ["is-following", id],
    queryFn: () => api.follow.findIsFollowing(id),
    enabled: !!id && use.includes("is-following"),
  });

  const isFollowing = React.useMemo(
    () => isFollowingResp?.isFollowing as boolean,
    [isFollowingResp]
  );

  const {
    data: followersResp,
    isPending: isFollowersPending,
    refetch: refetchFollowers,
  } = useQuery({
    queryKey: ["followers", id],
    queryFn: () => api.follow.findFollowers(id),
    enabled: !!id && use.includes("followers"),
  });

  const followers = React.useMemo(() => followersResp || [], [followersResp]);

  const {
    data: followingsResp,
    isPending: isFollowingPending,
    refetch: refetchFollowing,
  } = useQuery({
    queryKey: ["followings", id],
    queryFn: () => api.follow.findFollowing(id),
    enabled: !!id && use.includes("followings"),
  });

  const followings = React.useMemo(
    () => followingsResp || [],
    [followingsResp]
  );

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    mutationFn: () => api.follow.followUser(id),
    onSuccess: follow?.onSuccess,
    onError: follow?.onError,
  });

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useMutation({
    mutationFn: () => api.follow.unfollowUser(id!),
    onSuccess: unfollow?.onSuccess,
    onError: unfollow?.onError,
  });

  return {
    //is-following
    isFollowing,
    isIsFollowingPending,
    refetchIsFollowing,
    //followers
    followers,
    isFollowersPending,
    refetchFollowers,
    //following
    followings,
    isFollowingPending,
    refetchFollowing,
    //mutations
    followUser,
    isFollowPending,
    unfollowUser,
    isUnfollowPending,
  };
}
