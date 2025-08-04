import { api } from "@/api";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTableConfig, ServerErrorResponse, Upload } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUploadColumns } from "./columns";
import { cn } from "@/lib/utils";

import { useUploadDialog } from "./modals/UploadDialog";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-tables/data-table";

interface UploadsProps {
  className?: string;
}

export default function Uploads({ className }: UploadsProps) {
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Content Management" },
      { title: "Uploads", href: "/uploads" },
    ]);
    setIntro?.(
      "Uploads",
      "View, manage, and customize files to streamline access and ensure security."
    );
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

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
    data: uploadsResponse,
    isFetching: isUploadsPending,
    refetch: refetchUploads,
  } = useQuery({
    queryKey: [
      "uploads",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.upload.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const uploads = React.useMemo(() => {
    if (!uploadsResponse) return [];
    return uploadsResponse.data;
  }, [uploadsResponse]);

  const { mutate: uploadFiles, isPending: isUploadingPending } = useMutation({
    mutationFn: (files: File[]) => api.upload.uploadFiles(files),
    onSuccess: () => {
      toast.success("Successfully uploaded files");
      refetchUploads();
      closeUploadDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { uploadDialog, openUploadDialog, closeUploadDialog } = useUploadDialog(
    {
      uploadFiles: (files: File[]) => {
        uploadFiles(files);
      },
      isUploadPending: false,
    }
  );

  const context: DataTableConfig<Upload> = {
    singularName: "Upload",
    pluralName: "Uploads",
    createCallback: openUploadDialog,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: uploadsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (upload: Upload) => {},
  };

  const columns = getUploadColumns(context);

  const isPending =
    isUploadsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={uploads}
        context={context}
        isPending={isPending}
      />
      {uploadDialog}
    </div>
  );
}
