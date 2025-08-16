import React from "react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/content/useRoles";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { useUpdateUserFormStructure } from "./useUpdateUserFormStructure";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useRegions } from "@/hooks/content/useRegions";
import { defineStepper } from "@/components/ui/stepper";
import { UpdateUserDto, Upload } from "@/types";
import {
  profileSchema,
  updateUserSchema,
} from "@/types/validations/user.validation";
import { Spinner } from "@/components/shared/Spinner";
import { useUploadMutation } from "@/hooks/useUploadMutation";

const steps = [
  {
    id: "user-information",
    title: "User Information",
  },
  {
    id: "profile-information",
    title: "Profile Information",
  },
];

const { Stepper } = defineStepper(...steps);

interface UserUpdateFormProps {
  className?: string;
  updateUser?: (user: UpdateUserDto) => void;
  isUpdatePending?: boolean;
}

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({
  className,
  updateUser,
  isUpdatePending,
}) => {
  const userStore = useUserStore();
  const { roles, isFetchRolesPending } = useRoles();
  const { regions, isFetchRegionsPending } = useRegions();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("updateDto.profile.pictureId", response?.[0]?.id);
    },
    onError: (error: any) => {
      userStore.setNested("updateDtoErrors.pictureId", [error.message]);
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
      uploadPicture,
      isUploadPending,
    });

  const validateStep = React.useCallback(
    (stepId: string) => {
      if (stepId === "user-information") {
        const userResult = updateUserSchema(
          userStore.setManualPassword
        ).safeParse({
          ...userStore.updateDto,
          confirmPassword: userStore.confirmPassword,
        });

        if (!userResult.success) {
          userStore.set(
            "updateDtoErrors",
            userResult.error.flatten().fieldErrors
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
            profileResult.error.flatten().fieldErrors
          );
          return false;
        }
        return true;
      }
      return true;
    },
    [userStore]
  );

  const handleSubmit = () => {
    updateUser?.(userStore.updateDto);
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
                    disabled={isUpdatePending}
                  >
                    <Stepper.Title>{step.title}</Stepper.Title>
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
                      <FormBuilder structure={userUpdateFormStructure} />
                    )}
                    {methods.current.id === "profile-information" && (
                      <FormBuilder structure={profileUpdateFormStructure} />
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
                    <ArrowLeft /> Previous
                  </Button>
                )}
                <Button onClick={handleNext} disabled={isUpdatePending}>
                  {methods.isLast ? (
                    <>
                      <Save /> Update
                    </>
                  ) : (
                    <>
                      Next <ArrowRight />
                    </>
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
