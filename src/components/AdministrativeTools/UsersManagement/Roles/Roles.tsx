import React from "react";
import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RoleActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getRoleColumns } from "./data-table/columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useRoleCreateSheet } from "./modals/RoleCreateSheet";
import { useRoleManager } from "./hooks/useRoleManager";
import { useRoleUpdateSheet } from "./modals/RoleUpdateSheet";
import { useRoleDeleteDialog } from "./modals/RoleDeleteDialog";
import { useRoleDuplicateDialog } from "./modals/RoleDuplicateDialog";
import { toast } from "sonner";
import { CreateRoleDto, UpdateRoleDto } from "@/types/user-management";
import { ROLE_FILTER_ATTRIBUTES } from "@/constants/role.filter-fields";
import { createSearchFilterExpression } from "@/lib/object.util";

export default function Roles() {
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management" },
      { title: "Roles", href: "/users-management/roles" },
    ]);
  }, []);

  const roleManager = useRoleManager();
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
    data: rolesResponse,
    isFetching: isRolesPending,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: [
      "roles",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.role.findPaginated(
        debouncedPage,
        debouncedSize,
        `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        debouncedSearchTerm
          ? createSearchFilterExpression(
              ROLE_FILTER_ATTRIBUTES,
              "||$cont||",
              debouncedSearchTerm,
              ";"
            )
          : ""
      ),
  });

  const roles = React.useMemo(() => {
    if (!rolesResponse) return [];
    return rolesResponse.data;
  }, [rolesResponse]);

  const { mutate: createRole, isPending: isCreationPending } = useMutation({
    mutationFn: (role: CreateRoleDto) => api.role.create(role),
    onSuccess: () => {
      toast("Role Created Successfully");
      refetchRoles();
      roleManager.reset();
      closeCreateRoleSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: number; role: UpdateRoleDto }) =>
      api.role.update(data.id, data.role),
    onSuccess: () => {
      toast("Role Updated Successfully");
      refetchRoles();
      roleManager.reset();
      closeUpdateRoleSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: deleteRole, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.role.remove(id),
    onSuccess: () => {
      toast("Role Deleted Successfully");
      refetchRoles();
      roleManager.reset();
      closeDeleteRoleDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: duplicateRole, isPending: isDuplicationPending } =
    useMutation({
      mutationFn: (id?: number) => api.role.duplicate(id),
      onSuccess: () => {
        toast("Role Duplicated Successfully");
        refetchRoles();
        roleManager.reset();
        closeDuplicateRoleDialog();
      },
      onError: (error) => {
        toast(error.message);
      },
    });

  const handleCreateSubmit = () => {
    const data = roleManager.getRole();
    const payload: CreateRoleDto = {
      label: data.label,
      description: data.description,
      permissionIds: roleManager.permissions
        ?.map((permission) => permission?.id)
        .filter((id): id is number => id !== undefined),
    };
    createRole(payload);
  };

  const handleUpdateSubmit = () => {
    const data = roleManager.getRole();
    updateRole({
      id: data.id!,
      role: {
        label: data.label,
        description: data.description,
        permissionIds: roleManager.permissions
          ?.map((permission) => permission.id)
          .filter((id): id is number => id !== undefined),
      },
    });
  };

  const { createRoleSheet, openCreateRoleSheet, closeCreateRoleSheet } =
    useRoleCreateSheet({
      createRole: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetRole: () => roleManager.reset(),
    });

  const { updateRoleSheet, openUpdateRoleSheet, closeUpdateRoleSheet } =
    useRoleUpdateSheet({
      updateRole: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetRole: () => roleManager.reset(),
    });

  const { deleteRoleDialog, openDeleteRoleDialog, closeDeleteRoleDialog } =
    useRoleDeleteDialog({
      roleLabel: roleManager.label,
      deleteRole: () => deleteRole(roleManager.id),
      isDeletionPending,
      resetRole: () => roleManager.reset(),
    });

  const {
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  } = useRoleDuplicateDialog({
    roleLabel: roleManager.label,
    duplicateRole: () => duplicateRole(roleManager.id),
    isDuplicationPending,
    resetRole: () => roleManager.reset(),
  });

  const context = {
    openCreateRoleSheet,
    openUpdateRoleSheet,
    openDeleteRoleDialog,
    openDuplicateRoleDialog,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: rolesResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending =
    isRolesPending || paging || resizing || searching || sorting;
  return (
    <RoleActionsContext.Provider value={context}>
      <ContentSection
        title="Roles"
        desc="Define and assign roles to streamline permissions and access control for users."
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getRoleColumns()}
          data={roles}
          isPending={isPending}
        />
      </ContentSection>
      {createRoleSheet}
      {deleteRoleDialog}
      {updateRoleSheet}
      {duplicateRoleDialog}
    </RoleActionsContext.Provider>
  );
}
