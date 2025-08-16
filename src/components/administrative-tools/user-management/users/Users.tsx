import React from "react";
import { cn } from "@/lib/utils";
import { api } from "@/api";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserColumns } from "./columns";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { useUserCreateSheet } from "./modals/UserCreateSheet";
import { useUserUpdateSheet } from "./modals/UserUpdateSheet";
import { useUserDeleteDialog } from "./modals/UserDeleteDialog";
import { useActivateUserDialog } from "./modals/UserActivateDialog";
import { useDeactivateUserDialog } from "./modals/UserDeactivateDialog";
import { useUserStore } from "@/hooks/stores/useUserStore";
import {
  CreateUserDto,
  DataTableConfig,
  Gender,
  ResponseUserDto,
  ServerErrorResponse,
  UpdateUserDto,
} from "@/types";
import {
  createUserSchema,
  updateUserSchema,
} from "@/types/validations/user.validation";
import { useIntro } from "@/contexts/IntroContext";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useApproveUserDialog } from "./modals/UserApproveDialog";
import { useDisapproveUserDialog } from "./modals/UserDisapproveDialog";
import { useTranslation } from "react-i18next";
import { identifyUser } from "@/lib/user.utils";

interface UsersProps {
  className?: string;
}

export default function Users({ className }: UsersProps) {
  const queryClient = useQueryClient();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const { t, ready } = useTranslation("user-management");
  React.useEffect(() => {
    if (ready) {
      setRoutes?.([
        { title: t("userManagement.page.title") },
        {
          title: t("userManagement.page.users"),
          href: "/users-management/users",
        },
      ]);
      setIntro?.(
        t("userManagement.page.users"),
        t("userManagement.page.description")
      );
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [ready, t]);

  const userStore = useUserStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: usersResponse,
    isFetching: isUsersPending,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [
      "users",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.user.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.data;
  }, [usersResponse]);

  const { mutate: createUser, isPending: isCreatePending } = useMutation({
    mutationFn: (user: CreateUserDto) => api.admin.user.create(user),
    onSuccess: () => {
      toast(t("userManagement.messages.userCreatedSuccess"));
      closeCreateUserSheet();
      userStore.reset();
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.admin.user.update(data.id, data.user),
    onSuccess: () => {
      toast(t("userManagement.messages.userUpdatedSuccess"));
      refetchUsers();
      userStore.reset();
      closeUpdateUserSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.remove(id),
    onSuccess: () => {
      toast(t("userManagement.messages.userDeletedSuccess"));
      refetchUsers();
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.activate(id),
    onSuccess: () => {
      toast(t("userManagement.messages.userActivatedSuccess"));
      refetchUsers();
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } =
    useMutation({
      mutationFn: (id?: string) => api.admin.user.deactivate(id),
      onSuccess: () => {
        toast(t("userManagement.messages.userDeactivatedSuccess"));
        refetchUsers();
      },
      onError: (error) => toast(error.message),
    });

  const { mutate: approveUser, isPending: isApprovalPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.approve(id),
    onSuccess: () => {
      toast(t("userManagement.messages.userApprovedSuccess"));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: disapproveUser, isPending: isDisapprovalPending } =
    useMutation({
      mutationFn: (id?: string) => api.admin.user.disapprove(id),
      onSuccess: () => {
        toast(t("userManagement.messages.userDisapprovedSuccess"));
        refetchUsers();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const { data: blob } = useQuery({
    queryKey: ["picture", userStore.response?.profile?.pictureId],
    queryFn: () =>
      api.upload.getUploadById(userStore.response?.profile?.pictureId!),
    enabled: !!userStore.response?.profile?.pictureId,
  });

  const handleUpdateSubmit = () => {
    const data = userStore.updateDto;
    const result = updateUserSchema(userStore.setManualPassword).safeParse({
      ...data,
      confirmPassword: userStore.confirmPassword,
    });
    if (!result.success) {
      userStore.set("updateDtoErrors", result.error.flatten().fieldErrors);
    } else {
      updateUser({ id: userStore.response?.id, user: data });
    }
  };

  const handleReset = () => {
    userStore.reset();
  };

  const { createUserSheet, openCreateUserSheet, closeCreateUserSheet } =
    useUserCreateSheet({
      createUser,
      isCreatePending,
      resetUser: handleReset,
    });

  const { updateUserSheet, openUpdateUserSheet, closeUpdateUserSheet } =
    useUserUpdateSheet({
      updateUser: handleUpdateSubmit,
      isUpdatePending,
      resetUser: handleReset,
    });

  const { deleteUserDialog, openDeleteUserDialog } = useUserDeleteDialog({
    userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    deleteUser: () => deleteUser(userStore.response?.id),
    isDeletePending: isDeletionPending,
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    activateUser: () => activateUser(userStore.response?.id),
    isActivationPending,
    resetUser: handleReset,
  });

  const { deactivateUserDialog, openDeactivateUserDialog } =
    useDeactivateUserDialog({
      userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
      deactivateUser: () => deactivateUser(userStore.response?.id),
      isDeactivationPending,
      resetUser: () => userStore.reset(),
    });

  const { approveUserDialog, openApproveUserDialog } = useApproveUserDialog({
    representation: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    approveUser: () => approveUser(userStore.response?.id),
    isApprovalPending,
    resetUser: () => userStore.reset(),
  });

  const { disapproveUserDialog, openDisapproveUserDialog } =
    useDisapproveUserDialog({
      representation: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
      disapproveUser: () => disapproveUser(userStore.response?.id),
      isDisapprovalPending,
      resetUser: () => userStore.reset(),
    });

  const context: DataTableConfig<ResponseUserDto> = {
    singularName: `${t("userManagement.page.user")}`,
    pluralName: `${t("userManagement.page.users")}`,
    createCallback: openCreateUserSheet,
    updateCallback: openUpdateUserSheet,
    deleteCallback: openDeleteUserDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openActivateUserDialog,
          actionLabel: t("userManagement.page.activate"),
          actionIcon: <ArrowUp />,
          isActionVisible: (user: ResponseUserDto) => !user.isActive,
        },
        {
          actionCallback: openDeactivateUserDialog,
          actionLabel: t("userManagement.page.deactivate"),
          actionIcon: <ArrowDown />,
          isActionVisible: (user: ResponseUserDto) => !!user.isActive,
        },
        {
          actionCallback: openApproveUserDialog,
          actionLabel: t("userManagement.page.approve"),
          actionIcon: <ArrowUp />,
          isActionVisible: (user: ResponseUserDto) => !user.isApproved,
        },
        {
          actionCallback: openDisapproveUserDialog,
          actionLabel: t("userManagement.page.disapprove"),
          actionIcon: <ArrowDown />,
          isActionVisible: (user: ResponseUserDto) => !!user.isApproved,
        },
      ],
    },
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: usersResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (user: ResponseUserDto) => {
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
        profile: {
          phone: user.profile?.phone,
          cin: user.profile?.cin,
          regionId: user.profile?.regionId,
          bio: user.profile?.bio,
          gender: user.profile?.gender as Gender,
          isPrivate: user.profile?.isPrivate,
        },
      });
      userStore.set(
        "picture",
        queryClient.getQueryData(["profile-picture", user.profile?.pictureId])
      );
    },
  };

  const columns = useUserColumns(context, t);

  const isPending =
    isUsersPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={users}
        context={context}
        isPending={isPending}
      />
      {createUserSheet}
      {updateUserSheet}
      {deleteUserDialog}
      {activateUserDialog}
      {deactivateUserDialog}
      {approveUserDialog}
      {disapproveUserDialog}
    </div>
  );
}
