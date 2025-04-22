import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoleColumns } from "./columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useRoleUpdateSheet } from "./modals/RoleUpdateSheet";
import { useRoleDeleteDialog } from "./modals/RoleDeleteDialog";
import { useRoleDuplicateDialog } from "./modals/RoleDuplicateDialog";
import { toast } from "sonner";
import { Role } from "@/types/user-management";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { useRoleCreateSheet } from "./modals/RoleCreateSheet";
import { ServerResponse, RolePermission, DataTableConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useIntro } from "@/context/IntroContext";
import { DataTable } from "@/components/Common/Datatables/data-table";
import { Copy } from "lucide-react";

interface RolesProps {
  className?: string;
}

export default function Roles({ className }: RolesProps) {
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "User Management", href: "/user-management" },
      { title: "Role", href: "/user-management/roles" },
    ]);
    setIntro?.(
      "Roles",
      "Define and assign roles to streamline permissions and access control for users."
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const roleStore = useRoleStore();
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
      api.admin.role.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const roles = React.useMemo(() => {
    if (!rolesResponse) return [];
    return rolesResponse.data;
  }, [rolesResponse]);

  const { mutate: createRole, isPending: isCreationPending } = useMutation({
    mutationFn: (role: Partial<Role>) => api.admin.role.create(role),
    onSuccess: (response: ServerResponse<Role>) => {
      toast(response.message);
      refetchRoles();
      roleStore.reset();
      closeCreateRoleSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: number; role: Partial<Role> }) =>
      api.admin.role.update(data.id, data.role),
    onSuccess: (response: ServerResponse<Role>) => {
      toast(response.message);
      refetchRoles();
      roleStore.reset();
      closeUpdateRoleSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: deleteRole, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.admin.role.remove(id),
    onSuccess: (response: ServerResponse<Role>) => {
      toast(response.message);
      refetchRoles();
      roleStore.reset();
      closeDeleteRoleDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: duplicateRole, isPending: isDuplicationPending } =
    useMutation({
      mutationFn: (id?: number) => api.admin.role.duplicate(id),
      onSuccess: (response: ServerResponse<Role>) => {
        toast(response.message);
        refetchRoles();
        roleStore.reset();
        closeDuplicateRoleDialog();
      },
      onError: (error) => {
        toast(error.message);
      },
    });

  const handleCreateSubmit = () => {
    const data = roleStore.getRole();
    const payload: Partial<Role> = {
      label: data.label,
      description: data.description,
      permissions: roleStore.permissions?.map((permission: RolePermission) => {
        return {
          permissionId: permission?.id,
        } as RolePermission;
      }),
    };
    createRole(payload);
  };

  const handleUpdateSubmit = () => {
    const data = roleStore.getRole();
    updateRole({
      id: data.id!,
      role: {
        label: data.label,
        description: data.description,
        permissions: roleStore.permissions?.map(
          (permission: RolePermission) => {
            return {
              permissionId: permission?.id,
            } as RolePermission;
          }
        ),
      },
    });
  };

  const { createRoleSheet, openCreateRoleSheet, closeCreateRoleSheet } =
    useRoleCreateSheet({
      createRole: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetRole: () => roleStore.reset(),
    });

  const { updateRoleSheet, openUpdateRoleSheet, closeUpdateRoleSheet } =
    useRoleUpdateSheet({
      updateRole: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetRole: () => roleStore.reset(),
    });

  const { deleteRoleDialog, openDeleteRoleDialog, closeDeleteRoleDialog } =
    useRoleDeleteDialog({
      roleLabel: roleStore.label,
      deleteRole: () => deleteRole(roleStore.id),
      isDeletionPending,
      resetRole: () => roleStore.reset(),
    });

  const {
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  } = useRoleDuplicateDialog({
    roleLabel: roleStore.label,
    duplicateRole: () => duplicateRole(roleStore.id),
    isDuplicationPending,
    resetRole: () => roleStore.reset(),
  });

  const context: DataTableConfig<Role> = {
    singularName: "Role",
    pluralName: "Roles",
    createCallback: openCreateRoleSheet,
    updateCallback: openUpdateRoleSheet,
    deleteCallback: openDeleteRoleDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openDuplicateRoleDialog,
          actionLabel: "Duplicate",
          actionIcon: <Copy className="h-4 w-4" />,
          isActionVisible: () => true,
        },
      ],
    },
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

  const columns = getRoleColumns(context);

  const isPending =
    isRolesPending || paging || resizing || searching || sorting;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={roles}
        context={context}
        isPending={isPending}
      />
      {createRoleSheet}
      {deleteRoleDialog}
      {updateRoleSheet}
      {duplicateRoleDialog}
    </div>
  );
}
