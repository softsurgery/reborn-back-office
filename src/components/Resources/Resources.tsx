import React, { useEffect } from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import { useInfiniteUploads } from "@/hooks/content/useInfiniteUploads";
import { ResourceCard } from "./ResourceCard";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { PackageOpen } from "lucide-react";
import { ResourcesActionBar } from "./ResourcesActionBar";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { useResourceDeleteDialog } from "./modal/ResourceDeleteDialog";
import { useResourcePreviewSheet } from "./modal/ResourcePreviewSheet";
import { useResourceCreateSheet } from "./modal/ResourceCreateSheet";
import { Upload } from "@/prisma/interfaces";

interface ResourcesProps {
  className?: string;
}

const ResourceCardSkeletons = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <ResourceCard key={`skeleton-${i}`} isPending resource={{} as any} />
  ));
};

export const Resources = ({ className }: ResourcesProps) => {
  const [resource, setResource] = React.useState<Partial<Upload>>();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "filename",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteUploads({
    search: debouncedSearchTerm,
    sortKey: debouncedSortDetails.sortKey,
    order: debouncedSortDetails.order ? "ASC" : "DESC",
  });

  useEffect(() => {
    setRoutes?.([
      { title: "Content" },
      { title: "Resources", href: `/content/resources` },
    ]);
    setIntro?.("Resources", `View, create, and manage your resources.`);

    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const { mutate: deleteUpload, isPending: isDeletionPending } = useMutation({
    mutationFn: (slug: string) => api.admin.upload.deleteFile(slug),
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { createResourceSheet, openCreateResourceSheet } =
    useResourceCreateSheet({});

  const { deleteResourceDialog, openDeleteResourceDialog } =
    useResourceDeleteDialog({
      representation: resource?.filename,
      deleteResource: () => deleteUpload(resource?.slug as string),
      isDeletionPending,
    });

  const { previewResourceSheet, openPreviewResourceSheet } =
    useResourcePreviewSheet({
      representation: resource?.filename,
    });

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-hidden container rounded-xl p-2 pb-4",
        className
      )}
    >
      {/* Top bar */}
      <ResourcesActionBar
        openCreateResourceSheet={openCreateResourceSheet}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Content */}
      <div
        className={cn(
          "flex flex-col overflow-auto no-scrollbar pt-5 rounded-xl",
          data.length === 0 && !isPending && "flex-1"
        )}
        onScroll={handleScroll}
      >
        {isPending && data.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <ResourceCardSkeletons />
          </div>
        ) : data.length === 0 ? (
          <div className="flex gap-4 flex-col justify-center items-center flex-1">
            <PackageOpen size={48} />
            <p className="font-bold"> No Resources Found </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                previewResource={() => {
                  setResource(resource);
                  openPreviewResourceSheet();
                }}
                deleteResource={() => {
                  setResource(resource);
                  openDeleteResourceDialog();
                }}
              />
            ))}
            {isFetchingNextPage && <ResourceCardSkeletons />}
          </div>
        )}
      </div>
      {previewResourceSheet}
      {deleteResourceDialog}
      {createResourceSheet}
    </div>
  );
};
