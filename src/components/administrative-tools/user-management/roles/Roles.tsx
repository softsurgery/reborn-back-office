import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRoleColumns } from "./columns";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useRoleUpdateSheet } from "./modals/RoleUpdateSheet";
import { useRoleDeleteDialog } from "./modals/RoleDeleteDialog";
import { useRoleDuplicateDialog } from "./modals/RoleDuplicateDialog";
import { toast } from "sonner";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { useRoleCreateSheet } from "./modals/RoleCreateSheet";
import { cn } from "@/lib/utils";
import { useIntro } from "@/contexts/IntroContext";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CreateRoleDto,
  DataTableConfig,
  ResponseRoleDto,
  ServerErrorResponse,
  UpdateRoleDto,
} from "@/types";

interface RolesProps {
  className?: string;
}

export default function Roles({ className }: RolesProps) {
  const { t, ready } = useTranslation("role");
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      {
        title: "User Management",
        href: "/administrative-tools/user-management",
      },
      {
        title: t("page.title"),
        href: "/administrative-tools/user-management/roles",
      },
    ]);
    setIntro?.(t("page.title"), t("page.description"));
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [t, ready]);

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
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
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
    mutationFn: (role: CreateRoleDto) => api.admin.role.create(role),
    onSuccess: () => {
      toast(t("messages.createSuccess"));
      refetchRoles();
      roleStore.reset();
      closeCreateRoleSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; role?: UpdateRoleDto }) =>
      api.admin.role.update(data.id, data.role),
    onSuccess: () => {
      toast(t("messages.updateSuccess"));
      refetchRoles();
      roleStore.reset();
      closeUpdateRoleSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteRole, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.admin.role.remove(id),
    onSuccess: () => {
      toast(t("messages.deleteSuccess"));
      refetchRoles();
      roleStore.reset();
      closeDeleteRoleDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: duplicateRole, isPending: isDuplicationPending } =
    useMutation({
      mutationFn: (id?: string) => api.admin.role.duplicate(id),
      onSuccess: () => {
        toast(t("messages.duplicateSuccess"));
        refetchRoles();
        roleStore.reset();
        closeDuplicateRoleDialog();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const handleCreateSubmit = () => {
    const data = roleStore.createDto;
    createRole(data);
  };

  const handleUpdateSubmit = () => {
    const data = roleStore.updateDto;
    updateRole({ id: roleStore.response?.id, role: data });
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
      representation: roleStore.response?.label,
      deleteRole: () => deleteRole(roleStore.response?.id),
      isDeletionPending,
      resetRole: () => roleStore.reset(),
    });

  const {
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  } = useRoleDuplicateDialog({
    representation: roleStore.response?.label,
    duplicateRole: () => duplicateRole(roleStore.response?.id),
    isDuplicationPending,
    resetRole: () => roleStore.reset(),
  });

  const context: DataTableConfig<ResponseRoleDto> = {
    singularName: t("page.singularName"),
    pluralName: t("page.pluralName"),
    createCallback: openCreateRoleSheet,
    updateCallback: openUpdateRoleSheet,
    deleteCallback: openDeleteRoleDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openDuplicateRoleDialog,
          actionLabel: t("actions.duplicate"),
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
    targetEntity: (role: ResponseRoleDto) => {
      roleStore.setNested("response", role);
      roleStore.set<UpdateRoleDto>("updateDto", {
        label: role.label,
        description: role.description,
        permissions: role.permissions.map((p) => ({
          permissionId: p.permissionId,
        })),
      });
    },
  };

  const columns = useRoleColumns(context);

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
