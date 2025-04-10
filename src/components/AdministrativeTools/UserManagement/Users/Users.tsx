import React from "react";
import { api } from "@/api";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useDebounce } from "@/hooks/useDebounce";
import { updateUserSchema } from "@/types/validations/user.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserActionsContext } from "./data-table/action-context";
import { getUserColumns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useUserCreateSheet } from "./modals/UserCreateSheet";
import { useUserUpdateSheet } from "./modals/UserUpdateSheet";
import ContentSection from "@/components/Common/ContentSection";
import { User } from "@/types/user-management";
import { useUserDeleteDialog } from "./modals/UserDeleteDialog";
import { useActivateUserDialog } from "./modals/UserActivateDialog";
import { useDeactivateUserDialog } from "./modals/UserDeactivateDialog";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { ServerResponse } from "@/types";

export default function Users() {
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management" },
      { title: "Users", href: "/users-management/users" },
    ]);
  }, []);

  const userStore = useUserStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(5);
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
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.data;
  }, [usersResponse]);

  const { mutate: createUser, isPending: isCreationPending } = useMutation({
    mutationFn: (user: Partial<User>) => api.admin.user.create(user),
    onSuccess: () => {
      toast("User Created Successfully");
      refetchUsers();
      userStore.reset();
      closeCreateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: Partial<User> }) =>
      api.admin.user.update(data.id, data.user),
    onSuccess: (response: ServerResponse<User>) => {
      toast(response.message);
      refetchUsers();
      userStore.reset();
      closeUpdateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.remove(id),
    onSuccess: (response: ServerResponse<User>) => {
      toast(response.message);
      refetchUsers();
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.activate(id),
    onSuccess: (response: ServerResponse<User>) => {
      toast(response.message);
      refetchUsers();
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } =
    useMutation({
      mutationFn: (id?: string) => api.admin.user.deactivate(id),
      onSuccess: (response: ServerResponse<User>) => {
        refetchUsers();
        toast(response.message);
      },
      onError: (error) => toast(error.message),
    });

  const handleCreateSubmit = () => {
    const data = userStore.getUser();
    const result = updateUserSchema.safeParse({
      ...data,
      confirmPassword: userStore.confirmPassword,
    });
    if (!result.success) {
      userStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      createUser(data);
    }
  };

  const handleUpdateSubmit = () => {
    const data = userStore.getUser();
    const result = updateUserSchema.safeParse({
      ...data,
      confirmPassword: userStore.confirmPassword,
    });
    if (!result.success) {
      userStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      updateUser({ id: userStore.id, user: data });
    }
  };

  const { createUserSheet, openCreateUserSheet, closeCreateUserSheet } =
    useUserCreateSheet({
      createUser: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetUser: () => userStore.reset(),
    });

  const { updateUserSheet, openUpdateUserSheet, closeUpdateUserSheet } =
    useUserUpdateSheet({
      updateUser: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetUser: () => userStore.reset(),
    });

  const { deleteUserDialog, openDeleteUserDialog } = useUserDeleteDialog({
    deleteUser: () => deleteUser(userStore?.id),
    isDeletePending: isDeletionPending,
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname: `${userStore.firstName} - ${userStore.lastName}`,
    activateUser: () => activateUser(userStore.id),
    isActivationPending,
    resetUser: () => userStore.reset(),
  });

  const { deactivateUserDialog, openDeactivateUserDialog } =
    useDeactivateUserDialog({
      userFullname: `${userStore.firstName} - ${userStore.lastName}`,
      deactivateUser: () => deactivateUser(userStore.id),
      isDeactivationPending,
      resetUser: () => userStore.reset(),
    });

  const context = {
    openCreateUserSheet,
    openUpdateUserSheet,
    openActivateUserDialog,
    openDeactivateUserDialog,
    openDeleteUserDialog,
    // openDuplicateUserDialog,
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
  };

  const isPending =
    isUsersPending || paging || resizing || searching || sorting;

  return (
    <UserActionsContext.Provider value={context}>
      <ContentSection
        title="Users"
        desc="View, manage, and customize user accounts to streamline access and ensure security."
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getUserColumns()}
          data={users}
          isPending={isPending}
        />
      </ContentSection>
      {createUserSheet}
      {updateUserSheet}
      {deleteUserDialog}
      {activateUserDialog}
      {deactivateUserDialog}
    </UserActionsContext.Provider>
  );
}
