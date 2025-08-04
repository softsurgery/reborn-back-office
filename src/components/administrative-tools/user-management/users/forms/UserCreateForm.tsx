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
import { CreateUserDto } from "@/types";

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
  const userStore = useUserStore();
  const { regions, isFetchRegionsPending } = useRegions();
  const { roles, isFetchRolesPending } = useRoles();
  const { userFormStructure, profileFormStructure } =
    useCreateUserFormStructure({
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
        return true;
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
        return true;
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
                    <Stepper.Title>{step.title}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Content */}
              {isFetchRegionsPending ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden mt-4">
                  <div className="flex-1 overflow-auto px-2">
                    {methods.current.id === "user-information" && (
                      <FormBuilder structure={userFormStructure} />
                    )}
                    {methods.current.id === "profile-information" && (
                      <FormBuilder structure={profileFormStructure} />
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
                    <ArrowLeft /> Previous
                  </Button>
                )}
                <Button onClick={handleNext} disabled={isCreatePending}>
                  {methods.isLast ? (
                    <>
                      <Save /> Create
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
