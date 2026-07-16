"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import {
  profileSchema,
  updateUserSchema,
} from "@/types/validations/user.validation";
import { Gender, ServerErrorResponse, UpdateUserDto, Upload } from "@/types";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useIdentifiedUser } from "@/hooks/content/User/useIdentifiedUser";
import { useUpload } from "@/hooks/content/useUpload";
import { useUploads } from "@/hooks/content/useUploads";
import { useRoles } from "@/hooks/content/useRoles";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { useUpdateUserFormStructure } from "./useUpdateUserFormStructure";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useRegions } from "@/hooks/content/useRegions";
import { Spinner } from "@/components/shared/Spinner";
import { useUploadMutation } from "@/hooks/useUploadMutation";

const steps = [
  {
    id: "user-information",
    title: "userManagement.forms.step1Title",
  },
  {
    id: "profile-information",
    title: "userManagement.forms.step2Title",
  },
];

const { Stepper } = defineStepper(...steps);

interface UpdateUserProps {
  id: string;
  className?: string;
  updateUser?: (user: UpdateUserDto) => void;
  isUpdatePending?: boolean;
}

export const UpdateUser = ({
  id,
  className,
  updateUser: propUpdateUser,
  isUpdatePending: propIsUpdatePending,
}: UpdateUserProps) => {
  const { t: tCommon } = useTranslation("common");
  const { t: tUser, ready } = useTranslation("user-management");
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
      const uploads = user?.uploads?.sort((a, b) => a.order - b.order) || [];
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
    if (!propUpdateUser) {
      setRoutes?.([
        { title: tUser("userManagement.page.title") },
        {
          title: tUser("userManagement.page.users"),
          href: "/user-management/users",
        },
        {
          title: tUser("userManagement.page.editUser"),
          href: `/user-management/users/edit/${id}`,
        },
      ]);
      setIntro?.(
        tUser("userManagement.page.editUser"),
        tUser("userManagement.page.description"),
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [ready, tUser, id, propUpdateUser]);

  const { mutate: updateUserMutation, isPending: isMutationPending } =
    useMutation({
      mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
        api.admin.user.update(data.id, data.user),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user", userStore.response?.email],
        });
        toast.success(tUser("userManagement.messages.userUpdatedSuccess"));
        userStore.reset();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message ?? tUser("common.error"));
      },
    });

  const isUpdatePending = propIsUpdatePending ?? isMutationPending;

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

    if (propUpdateUser) {
      propUpdateUser(data);
    } else {
      updateUserMutation(
        { id: userStore.response?.id, user: data },
        {
          onSuccess: () => {
            router.push("/user-management/users");
          },
        },
      );
    }
  };

  const { roles, isFetchRolesPending } = useRoles();
  const { regions, isFetchRegionsPending } = useRegions();

  const {
    uploadFiles: uploadProfilePictureMutation,
    isUploadPending: isProfilePictureUploadPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("updateDto.pictureId", response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const {
    uploadFiles: uploadOfficialDocument,
    isUploadPending: isOfficialDocumentUploadPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("updateDto.officialDocumentId", response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const {
    uploadFiles: uploadDriverLicenseDocument,
    isUploadPending: isDriverLicenseDocumentPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested(
        "updateDto.driverLicenseDocumentId",
        response?.[0]?.id,
      );
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { uploadFiles: uploadPhotos, isUploadPending: isPhotosUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.appendUploadId("update", { uploadId: response?.[0]?.id });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const { userUpdateFormStructure, profileUpdateFormStructure } =
    useUpdateUserFormStructure({
      userStore,
      regions: mapToSelectOptions({
        data: isFetchRegionsPending ? [] : regions,
        labelKey: "label",
        valueKey: "id",
      }),
      roles: mapToSelectOptions({
        data: isFetchRolesPending ? [] : roles,
        labelKey: "label",
        valueKey: "id",
      }),
      uploadProfilePicture: uploadProfilePictureMutation,
      isProfilePictureUploadPending,

      uploadOfficialDocument,
      isOfficialDocumentUploadPending,

      uploadDriverLicenseDocument,
      isDriverLicenseDocumentPending,

      uploadPhotos,
      isPhotosUploadPending,
    });

  const validateStep = React.useCallback(
    (stepId: string) => {
      if (stepId === "user-information") {
        const userResult = updateUserSchema(
          userStore.setManualPassword,
        ).safeParse({
          ...userStore.updateDto,
          confirmPassword: userStore.confirmPassword,
        });

        if (!userResult.success) {
          userStore.set(
            "updateDtoErrors",
            userResult.error.flatten().fieldErrors,
          );
          return false;
        }
        return true;
      }

      if (stepId === "profile-information") {
        const profileResult = profileSchema.safeParse({
          ...userStore.updateDto,
          confirmPassword: userStore.confirmPassword,
        });
        if (!profileResult.success) {
          userStore.set(
            "updateDtoErrors",
            profileResult.error.flatten().fieldErrors,
          );
          return false;
        }
      }
      return true;
    },
    [userStore],
  );

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <Stepper.Provider
        className="flex flex-col flex-1 overflow-hidden"
        variant="horizontal"
      >
        {({ methods }) => {
          const activeIndex = steps.findIndex(
            (step) => step.id === methods.current.id,
          );

          const handleNext = () => {
            const valid = validateStep(methods.current.id);
            if (!valid) return;

            if (methods.isLast) {
              handleUpdateSubmit();
            } else {
              methods.next();
            }
          };

          return (
            <>
              {/* Navigation */}
              <Stepper.Navigation className="flex-shrink-0">
                {methods.all.map((step, index) => (
                  <Stepper.Step
                    key={step.id}
                    of={step.id}
                    onClick={() => {
                      if (index > activeIndex) {
                        let valid = true;
                        for (let i = 0; i <= activeIndex; i++) {
                          valid = valid && validateStep(steps[i].id);
                        }
                        if (!valid) return;
                      }
                      methods.goTo(step.id);
                    }}
                    disabled={isUpdatePending}
                  >
                    <Stepper.Title>{tUser(step.title)}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Content */}
              {isFetchRegionsPending && isFetchRolesPending ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                  <div className="flex-1 overflow-auto no-scrollbar px-2">
                    {methods.current.id === "user-information" && (
                      <FormBuilder
                        structure={userUpdateFormStructure}
                        className="mt-4"
                      />
                    )}
                    {methods.current.id === "profile-information" && (
                      <FormBuilder
                        structure={profileUpdateFormStructure}
                        className="mt-4"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
                {!methods.isFirst && (
                  <Button
                    variant="outline"
                    onClick={methods.prev}
                    disabled={isUpdatePending}
                  >
                    <ArrowLeft /> {tCommon("common.buttons.previous")}
                  </Button>
                )}
                <Button onClick={handleNext} disabled={isUpdatePending}>
                  {methods.isLast ? (
                    <React.Fragment>
                      <Save /> {tCommon("common.buttons.update")}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {tCommon("common.buttons.next")} <ArrowRight />
                    </React.Fragment>
                  )}
                </Button>
              </Stepper.Controls>
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
};
