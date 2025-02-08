import { api } from "@/api";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useDebounce } from "@/hooks/useDebounce";
import { updateUserSchema } from "@/types/validations/user.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { SafeParseReturnType } from "zod";
import { UserActionsContext } from "./data-table/action-context";
import { getUserColumns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useUserManager } from "./hooks/useUserManager";
import { useUserCreateSheet } from "./modals/UserCreateSheet";
import { useUserUpdateSheet } from "./modals/UserUpdateSheet";
import ContentSection from "@/components/Common/ContentSection";
import { User } from "@/types/user-management";
import { useUserDeleteDialog } from "./modals/UserDeleteDialog";
import { useActivateUserDialog } from "./modals/UserActivateDialog";
import { useDeactivateUserDialog } from "./modals/UserDeactivateDialog";
import { createSearchFilterExpression } from "@/lib/object.util";
import { USER_FILTER_ATTRIBUTES } from "@/constants/user.filter-fields";

export default function Users() {
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management" },
      { title: "Users", href: "/users-management/users" },
    ]);
  }, []);

  const userManager = useUserManager();

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
      api.user.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        debouncedSearchTerm
          ? createSearchFilterExpression(
              USER_FILTER_ATTRIBUTES,
              "||$cont||",
              debouncedSearchTerm,
              ";"
            )
          : ""
      ),
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.data;
  }, [usersResponse]);

  const { mutate: createUser, isPending: isCreationPending } = useMutation({
    mutationFn: (user: Partial<User>) => api.user.create(user),
    onSuccess: () => {
      toast("User Created Successfully");
      refetchUsers();
      userManager.reset();
      closeCreateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: Partial<User> }) =>
      api.user.update(data.id, data.user),
    onSuccess: () => {
      toast("User Updated Successfully");
      refetchUsers();
      userManager.reset();
      closeUpdateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.user.remove(id),
    onSuccess: () => {
      refetchUsers();
      toast("User Deleted Successfully");
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.user.activate(id),
    onSuccess: () => {
      refetchUsers();
      toast("User Activated Successfully");
    },
    onError: (error) => toast(error.message),
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } =
    useMutation({
      mutationFn: (id?: string) => api.user.deactivate(id),
      onSuccess: () => {
        refetchUsers();
        toast("User Deactivated Successfully");
      },
      onError: (error) => toast(error.message),
    });

  const handleValidation = (result: SafeParseReturnType<unknown, unknown>) => {
    const errorMessage = Object.values(
      result?.error?.flatten().fieldErrors ?? {}
    )
      .flat()
      .map((error) => `<li> . ${error}</li>`)
      .join("");
    toast("⛔ Validation Errors", {
      description: <ul dangerouslySetInnerHTML={{ __html: errorMessage }} />,
      position: "top-center",
    });
  };

  const handleCreateSubmit = () => {
    const data = userManager.getUser();
    const result = updateUserSchema.safeParse({
      ...data,
      confirmPassword: userManager.confirmPassword,
    });
    if (!result.success) {
      handleValidation(result);
    } else {
      createUser(data);
    }
  };

  const handleUpdateSubmit = () => {
    const data = userManager.getUser();
    console.log(data);
    const result = updateUserSchema.safeParse({
      ...data,
      confirmPassword: userManager.confirmPassword,
    });
    if (!result.success) {
      handleValidation(result);
    } else {
      updateUser({ id: userManager.id, user: data });
    }
  };

  const { createUserSheet, openCreateUserSheet, closeCreateUserSheet } =
    useUserCreateSheet({
      createUser: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetUser: () => userManager.reset(),
    });

  const { updateUserSheet, openUpdateUserSheet, closeUpdateUserSheet } =
    useUserUpdateSheet({
      updateUser: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetUser: () => userManager.reset(),
    });

  const { deleteUserDialog, openDeleteUserDialog } = useUserDeleteDialog({
    deleteUser: () => deleteUser(userManager?.id),
    isDeletePending: isDeletionPending,
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname: `${userManager.firstName} - ${userManager.lastName}`,
    activateUser: () => activateUser(userManager.id),
    isActivationPending,
    resetUser: () => userManager.reset(),
  });

  const { deactivateUserDialog, openDeactivateUserDialog } =
    useDeactivateUserDialog({
      userFullname: `${userManager.firstName} - ${userManager.lastName}`,
      deactivateUser: () => deactivateUser(userManager.id),
      isDeactivationPending,
      resetUser: () => userManager.reset(),
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
        {/*
         */}
        {/*
        {duplicateUserDialog} */}
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
