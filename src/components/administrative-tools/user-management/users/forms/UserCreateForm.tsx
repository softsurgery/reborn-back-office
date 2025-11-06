import React from "react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/content/useRoles";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { useCreateUserFormStructure } from "./useCreateUserFormStructure";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useRegions } from "@/hooks/content/useRegions";
import {
  createUserSchema,
  profileSchema,
} from "@/types/validations/user.validation";
import { Spinner } from "@/components/shared/Spinner";
import { CreateUserDto, ServerErrorResponse, Upload } from "@/types";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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

interface UserCreateFormProps {
  className?: string;
  createUser?: (user: CreateUserDto) => void;
  isCreatePending?: boolean;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  className,
  createUser,
  isCreatePending,
}) => {
  const { t: tCommon } = useTranslation("common");
  const { t: tUser } = useTranslation("user-management");
  const userStore = useUserStore();
  const { regions, isFetchRegionsPending } = useRegions();
  const { roles, isFetchRolesPending } = useRoles();

  const {
    uploadFiles: uploadProfilePicture,
    isUploadPending: isProfilePictureUploadPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("createDto.profile.pictureId", response?.[0]?.id);
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
      userStore.setNested(
        "createDto.profile.officialDocumentId",
        response?.[0]?.id
      );
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
        "createDto.profile.driverLicenseDocumentId",
        response?.[0]?.id
      );
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { uploadFiles: uploadPhotos, isUploadPending: isPhotosUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.appendUploadId("create", { uploadId: response?.[0]?.id });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const {
    userCreateFormStructure,
    profileCreateFormStructure,
  } = useCreateUserFormStructure({
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
    uploadProfilePicture,
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
        const userResult = createUserSchema.safeParse({
          ...userStore.createDto,
          confirmPassword: userStore.confirmPassword,
        });
        if (!userResult.success) {
          userStore.set(
            "createDtoErrors",
            userResult.error.flatten().fieldErrors
          );
          return false;
        }
      }

      if (stepId === "profile-information") {
        const profileResult = profileSchema.safeParse(
          userStore.createDto.profile
        );
        if (!profileResult.success) {
          userStore.set(
            "createDtoErrors",
            profileResult.error.flatten().fieldErrors
          );
          return false;
        }
      }
      return true;
    },
    [userStore]
  );

  const handleSubmit = () => {
    createUser?.(userStore.createDto);
  };

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
            (step) => step.id === methods.current.id
          );

          const handleNext = () => {
            const valid = validateStep(methods.current.id);
            if (!valid) return;

            if (methods.isLast) {
              handleSubmit();
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
                    disabled={isCreatePending}
                  >
                    <Stepper.Title>{tUser(step.title)}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Content */}
              {isFetchRegionsPending && isFetchRolesPending ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden mt-4">
                  <div className="flex-1 overflow-auto px-2">
                    {methods.current.id === "user-information" && (
                      <FormBuilder structure={userCreateFormStructure} />
                    )}
                    {methods.current.id === "profile-information" && (
                      <FormBuilder structure={profileCreateFormStructure} />
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
                    disabled={isCreatePending}
                  >
                    <ArrowLeft /> {tCommon("common.buttons.previous")}
                  </Button>
                )}
                <Button onClick={handleNext} disabled={isCreatePending}>
                  {methods.isLast ? (
                    <React.Fragment>
                      <Save /> {tCommon("common.buttons.save")}
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
