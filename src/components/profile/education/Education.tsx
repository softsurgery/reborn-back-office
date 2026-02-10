import React from "react";
import { cn } from "@/lib/utils";
import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEducationStore } from "@/hooks/stores/useEducationStore";
import {
  CreateEducationDto,
  ResponseEducationDto,
  ServerErrorResponse,
  UpdateEducationDto,
} from "@/types";
import { updateEducationSchema } from "@/types/validations/education.validation";
import { useTranslation } from "react-i18next";
import { useEducationCreateSheet } from "./modals/EducationCreateSheet";
import { useEducationUpdateSheet } from "./modals/EducationUpdateSheet";
import { useEducationDeleteDialog } from "./modals/EducationDeleteDialog";
import { EducationSection } from "./EducationSection";
import { Spinner } from "@/components/shared/Spinner";

interface EducationProps {
  className?: string;
  userId: string;
}

export const Education = ({ className, userId }: EducationProps) => {
  const { t } = useTranslation("user-management");
  const educationStore = useEducationStore();

  // Fetch educations for this user
  const {
    data: educations,
    isFetching: isEducationsPending,
    refetch: refetchEducations,
  } = useQuery({
    queryKey: ["userManagement.educations", userId],
    queryFn: () => api.admin.education.findAllByUser(userId),
  });

  // Create education mutation
  const { mutate: addEducation, isPending: isAddPending } = useMutation({
    mutationFn: (education: CreateEducationDto) =>
      api.admin.education.create(userId, education),
    onSuccess: () => {
      toast(t("userManagement.education.messages.createdSuccess"));
      closeEducationCreateSheet();
      educationStore.reset();
      refetchEducations();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Update education mutation
  const { mutate: updateEducation, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: string; education: UpdateEducationDto }) =>
      api.admin.education.update(data.id, data.education),
    onSuccess: () => {
      toast(t("userManagement.education.messages.updatedSuccess"));
      refetchEducations();
      educationStore.reset();
      closeEducationUpdateSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Delete education mutation
  const { mutate: deleteEducation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: string) => api.admin.education.remove(id),
    onSuccess: () => {
      toast(t("userManagement.education.messages.deletedSuccess"));
      refetchEducations();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  // Handle update submission with validation
  const handleUpdateSubmit = () => {
    const data = educationStore.updateDto;
    const result = updateEducationSchema.safeParse(data);
    if (!result.success) {
      educationStore.set("updateDtoErrors", result.error.flatten().fieldErrors);
    } else {
      if (educationStore.response?.id) {
        updateEducation({
          id: educationStore.response.id,
          education: data,
        });
      }
    }
  };

  // Reset store function
  const handleReset = () => {
    educationStore.reset();
  };

  // Create sheet hook
  const {
    educationCreateSheet,
    openEducationCreateSheet,
    closeEducationCreateSheet,
  } = useEducationCreateSheet({
    addEducation,
    isAddPending,
    resetEducation: handleReset,
    userId,
  });

  // Update sheet hook
  const {
    educationUpdateSheet,
    openEducationUpdateSheet,
    closeEducationUpdateSheet,
  } = useEducationUpdateSheet({
    updateEducation: handleUpdateSubmit,
    isUpdatePending,
    resetEducation: handleReset,
  });

  // Delete dialog hook
  const { educationDeleteDialog, openEducationDeleteDialog } =
    useEducationDeleteDialog({
      educationTitle: educationStore.response?.title,
      deleteEducation: () => {
        if (educationStore.response?.id) {
          deleteEducation(educationStore.response.id);
        }
      },
      isDeletePending: isDeletePending,
    });

  // Handle edit click - set education in store and open update sheet
  const handleEditClick = (education: ResponseEducationDto) => {
    educationStore.set("response", education);
    educationStore.set<UpdateEducationDto>("updateDto", {
      title: education.title,
      institution: education.institution,
      startDate: education.startDate,
      endDate: education.endDate,
      description: education.description,
    });
    openEducationUpdateSheet();
  };

  // Handle delete click - set education in store and open delete dialog
  const handleDeleteClick = (id: string) => {
    const educationToDelete = educations?.find((edu) => edu.id === id);
    if (educationToDelete) {
      educationStore.set("response", educationToDelete);
      openEducationDeleteDialog();
    }
  };

  const isPending = isEducationsPending;

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      {/* Content */}
      {isPending ? (
        <Spinner />
      ) : (
        <EducationSection
          educations={educations || []}
          onOpenAddSheet={openEducationCreateSheet}
          onOpenEditSheet={handleEditClick}
          onOpenDeleteDialog={handleDeleteClick}
        />
      )}

      {/* Modals */}
      {educationCreateSheet}
      {educationUpdateSheet}
      {educationDeleteDialog}
    </div>
  );
};
