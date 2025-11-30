"use client";
import React from "react";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserUpdateForm } from "../forms/UserUpdateForm";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { api } from "@/api";
import { updateUserSchema } from "@/types/validations/user.validation";
import {
  ServerErrorResponse,
  UpdateUserDto,
} from "@/types";
interface UserUpdatePageProps {
  id: string; 
}
export const UserUpdatePage: React.FC<UserUpdatePageProps> = ({ id }) => {
  const { t } = useTranslation("user-management");
  const userStore = useUserStore();
  const queryClient = useQueryClient();
const router = useRouter();

  // ✅ Mutation de mise à jour de l'utilisateur
  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.admin.user.update(data.id, data.user),

    onSuccess: () => {
      // Rafraîchir les données
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

  // ✅ Handler de soumission
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
    }
  );
};



   return (
    <div className="min-h-screen bg-black text-white flex flex-col p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-2xl font-semibold">
        <User className="w-6 h-6" />
        <span>{t("userManagement.sheet.updateUserTitle")}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6">
        {t("userManagement.sheet.updateUserDescription")}
      </p>

      {/* ✅ Conteneur scrollable */}
      <div className="flex-1 overflow-y-auto max-h-[80vh] rounded-xl p-4 border border-gray-800">
        <UserUpdateForm
          className="w-full"
          updateUser={handleUpdateSubmit}
          isUpdatePending={isUpdatePending}
        />
      </div>
    </div>
  );
};
