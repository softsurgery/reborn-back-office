"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import { updateUserSchema } from "@/types/validations/user.validation";
import { Gender, ServerErrorResponse, UpdateUserDto } from "@/types";
import { UserUpdateForm } from "./forms/UserUpdateForm";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useIdentifiedUser } from "@/hooks/content/User/useIdentifiedUser";
import { useUpload } from "@/hooks/content/useUpload";
import { useUploads } from "@/hooks/content/useUploads";

interface UpdateUserProps {
  id: string;
  className?: string;
}
export const UpdateUser = ({ id, className }: UpdateUserProps) => {
  const { t, ready } = useTranslation("user-management");
  const userStore = useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useIdentifiedUser(id);

  //fetch user images
  const uploadIds = Array.isArray(userStore.updateDto?.uploads)
    ? userStore.updateDto.uploads.map((u) => u.uploadId)
    : [];

  const { uploads: images, isPending: isImagesPending } = useUploads(uploadIds);

  React.useEffect(() => {
    if (
      images.length > 0 &&
      !userStore.hasInitializedImages &&
      userStore.images.length === 0
    ) {
      userStore.set("images", images);
      userStore.set("hasInitializedImages", true);
    }
  }, [images, userStore.hasInitializedImages]);

  const { upload: profilePicture, isUploadPending: isProfilePicturePending } =
    useUpload({
      id: userStore.updateDto?.pictureId,
      enabled: Boolean(userStore.updateDto?.pictureId),
    });
  React.useEffect(() => {
    if (profilePicture) {
      userStore.set("picture", profilePicture);
    }
  }, [profilePicture]);

  React.useEffect(() => {
    if (user) {
      const uploads = user?.uploads?.sort((a, b) => a.order - b.order);
      userStore.set("response", user);
      userStore.set<UpdateUserDto>("updateDto", {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isActive: user.isActive,
        isApproved: user.isApproved,
        username: user.username,
        email: user.email,
        password: "",
        roleId: user.roleId,
        phone: user?.phone,
        pictureId: user?.pictureId,
        cin: user?.cin,
        regionId: user?.regionId,
        bio: user?.bio,
        gender: user?.gender as Gender,
        isPrivate: user?.isPrivate,
        uploads: uploads.map((upload) => ({
          id: upload.id,
          uploadId: upload.uploadId,
        })),
      });
      userStore.set("picture", profilePicture);
    }
  }, [user]);

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setRoutes?.([
      { title: t("userManagement.page.title") },
      {
        title: t("userManagement.page.users"),
        href: "/user-management/users",
      },
      {
        title: t("userManagement.page.editUser"),
        href: `/user-management/users/edit/${id}`,
      },
    ]);
    setIntro?.(
      t("userManagement.page.editUser"),
      t("userManagement.page.description"),
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [ready, t]);

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.admin.user.update(data.id, data.user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", userStore.response?.email],
      });
      toast.success(t("userManagement.messages.userUpdatedSuccess"));
      userStore.reset();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message ?? t("common.error"));
    },
  });

  const handleUpdateSubmit = () => {
    const data = userStore.updateDto;

    const validation = updateUserSchema(userStore.setManualPassword).safeParse({
      ...data,
      confirmPassword: userStore.confirmPassword,
    });

    if (!validation.success) {
      userStore.set("updateDtoErrors", validation.error.flatten().fieldErrors);
      return;
    }

    updateUser(
      { id: userStore.response?.id, user: data },
      {
        onSuccess: () => {
          router.push("/user-management/users");
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <UserUpdateForm
        className="w-full container"
        updateUser={handleUpdateSubmit}
        isUpdatePending={isUpdatePending}
      />
    </div>
  );
};
