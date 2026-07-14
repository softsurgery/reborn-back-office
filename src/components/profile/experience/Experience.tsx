import React from "react";
import { cn } from "@/lib/utils";
import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useExperienceStore } from "@/hooks/stores/useExperienceStore";
import {
  CreateExperienceDto,
  ResponseExperienceDto,
  ServerErrorResponse,
  UpdateExperienceDto,
} from "@/types";
import { updateExperienceSchema } from "@/types/validations/experience.validation";
import { useTranslation } from "react-i18next";
import { useExperienceCreateSheet } from "./modals/ExperienceCreateSheet";
import { useExperienceUpdateSheet } from "./modals/ExperienceUpdateSheet";
import { useExperienceDeleteDialog } from "./modals/ExperienceDeleteDialog";
import { ExperienceSection } from "./ExperienceSection";
import { Spinner } from "@/components/shared/Spinner";

interface ExperienceProps {
  className?: string;
  userId: string;
}

export const Experience = ({ className, userId }: ExperienceProps) => {
  const { t } = useTranslation("user-management");
  const experienceStore = useExperienceStore();

  // Fetch experiences for this user
  const {
    data: experiences,
    isFetching: isExperiencesPending,
    refetch: refetchExperiences,
  } = useQuery({
    queryKey: ["experiences", userId],
    queryFn: () => api.admin.experience.findAllByUser(userId),
  });

  // Create experience mutation
  const { mutate: addExperience, isPending: isAddPending } = useMutation({
    mutationFn: (experience: CreateExperienceDto) =>
      api.admin.experience.create(userId, experience),
    onSuccess: () => {
      toast(t("userManagement.experience.messages.createdSuccess"));
      closeExperienceCreateSheet();
      experienceStore.reset();
      refetchExperiences();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Update experience mutation
  const { mutate: updateExperience, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: number; experience: UpdateExperienceDto }) =>
      api.admin.experience.update(data.id, data.experience),
    onSuccess: () => {
      toast(t("userManagement.experience.messages.updatedSuccess"));
      refetchExperiences();
      experienceStore.reset();
      closeExperienceUpdateSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Delete experience mutation
  const { mutate: deleteExperience, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.admin.experience.remove(id),
    onSuccess: () => {
      toast(t("userManagement.experience.messages.deletedSuccess"));
      refetchExperiences();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Handle update submission with validation
  const handleUpdateSubmit = () => {
    const data = experienceStore.updateDto;
    const result = updateExperienceSchema.safeParse(data);
    if (!result.success) {
      experienceStore.set(
        "updateDtoErrors",
        result.error.flatten().fieldErrors,
      );
    } else {
      if (experienceStore.response?.id) {
        updateExperience({
          id: experienceStore.response.id,
          experience: data,
        });
      }
    }
  };

  // Reset store function
  const handleReset = () => {
    experienceStore.reset();
  };

  // Create sheet hook
  const {
    experienceCreateSheet,
    openExperienceCreateSheet,
    closeExperienceCreateSheet,
  } = useExperienceCreateSheet({
    addExperience,
    isAddPending,
    resetExperience: handleReset,
    userId,
  });

  // Update sheet hook
  const {
    experienceUpdateSheet,
    openExperienceUpdateSheet,
    closeExperienceUpdateSheet,
  } = useExperienceUpdateSheet({
    updateExperience: handleUpdateSubmit,
    isUpdatePending,
    resetExperience: handleReset,
  });

  // Delete dialog hook
  const { experienceDeleteDialog, openExperienceDeleteDialog } =
    useExperienceDeleteDialog({
      experienceTitle: experienceStore.response?.title,
      deleteExperience: () => {
        if (experienceStore.response?.id) {
          deleteExperience(experienceStore.response.id);
        }
      },
      isDeletePending: isDeletePending,
    });

  // Handle edit click - set experience in store and open update sheet
  const handleEditClick = (experience: ResponseExperienceDto) => {
    experienceStore.set("response", experience);
    experienceStore.set<UpdateExperienceDto>("updateDto", {
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
    });
    openExperienceUpdateSheet();
  };

  // Handle delete click - set experience in store and open delete dialog
  const handleDeleteClick = (id: number) => {
    const experienceToDelete = experiences?.find((exp) => exp.id === id);
    if (experienceToDelete) {
      experienceStore.set("response", experienceToDelete);
      openExperienceDeleteDialog();
    }
  };

  const isPending = isExperiencesPending;

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      {/* Content */}
      {isPending ? (
        <Spinner />
      ) : (
        <ExperienceSection
          experiences={experiences || []}
          onOpenAddSheet={openExperienceCreateSheet}
          onOpenEditSheet={handleEditClick}
          onOpenDeleteDialog={handleDeleteClick}
        />
      )}

      {/* Modals */}
      {experienceCreateSheet}
      {experienceUpdateSheet}
      {experienceDeleteDialog}
    </div>
  );
};
