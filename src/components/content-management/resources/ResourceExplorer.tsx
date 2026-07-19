import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Folder,
  FolderPlus,
  Home,
  LayoutGrid,
  List,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/file.utils";
import { ServerErrorResponse, StorageFolder, Upload } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileIcon } from "@/components/content-management/uploads/FileIcon";
import { FolderTree } from "./FolderTree";
import { useUploadDialog } from "@/components/content-management/uploads/modals/UploadDialog";

type ViewMode = "grid" | "list";

interface ResourceExplorerProps {
  className?: string;
}

export default function ResourceExplorer({ className }: ResourceExplorerProps) {
  const queryClient = useQueryClient();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const [selectedFolderId, setSelectedFolderId] = React.useState<number>();
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [newFolderName, setNewFolderName] = React.useState("");
  const [showNewFolderInput, setShowNewFolderInput] = React.useState(false);

  React.useEffect(() => {
    setRoutes?.([
      { title: "Content Management" },
      { title: "Resources", href: "/content-management/resources" },
    ]);
    setIntro?.(
      "Resources",
      "Browse folders and files in a file explorer-style view.",
    );

    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [clearIntro, clearRoutes, setIntro, setRoutes]);

  const {
    data: contents,
    isFetching,
    refetch: refetchContents,
  } = useQuery({
    queryKey: ["storage-folder-contents", selectedFolderId ?? "root"],
    queryFn: () =>
      selectedFolderId
        ? api.storageFolder.getFolderContents(selectedFolderId)
        : api.storageFolder.getRootContents(),
  });

  const { data: breadcrumb = [] } = useQuery({
    queryKey: ["storage-folder-breadcrumb", selectedFolderId],
    queryFn: () =>
      selectedFolderId
        ? api.storageFolder.getBreadcrumb(selectedFolderId)
        : Promise.resolve([]),
    enabled: Boolean(selectedFolderId),
  });

  const { mutate: uploadFiles, isPending: isUploading } = useMutation({
    mutationFn: (files: File[]) =>
      api.upload.uploadFiles(files, undefined, false, selectedFolderId),
    onSuccess: () => {
      toast.success("Files uploaded successfully");
      refetchContents();
      queryClient.invalidateQueries({ queryKey: ["storage-folder-tree"] });
      closeUploadDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });

  const { mutate: createFolder, isPending: isCreatingFolder } = useMutation({
    mutationFn: () =>
      api.storageFolder.createFolder({
        name: newFolderName.trim(),
        parentId: selectedFolderId,
      }),
    onSuccess: () => {
      toast.success("Folder created");
      setNewFolderName("");
      setShowNewFolderInput(false);
      refetchContents();
      queryClient.invalidateQueries({ queryKey: ["storage-folder-tree"] });
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || "Failed to create folder");
    },
  });

  const { uploadDialog, openUploadDialog, closeUploadDialog } = useUploadDialog(
    {
      uploadFiles,
      isUploadPending: isUploading,
    },
  );

  const folders = contents?.folders ?? [];
  const files = contents?.files ?? [];

  const handleOpenFolder = (folder: StorageFolder) => {
    setSelectedFolderId(folder.id);
  };

  const handleDownload = async (file: Upload) => {
    await api.upload.downloadFile(file.slug, file.filename);
  };

  const handleOpenFile = async (file: Upload) => {
    await api.upload.openFile(file.slug);
  };

  return (
    <div className={cn("flex h-full flex-1 flex-col overflow-hidden", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex cursor-pointer items-center gap-1"
                onClick={() => setSelectedFolderId(undefined)}
              >
                <Home className="h-4 w-4" />
                Root
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumb.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === breadcrumb.length - 1 ? (
                    <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="cursor-pointer"
                      onClick={() => setSelectedFolderId(folder.id)}
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setShowNewFolderInput(true)}>
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={openUploadDialog}>
            <UploadCloud className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {showNewFolderInput && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border bg-card p-3">
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(event) => setNewFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && newFolderName.trim()) {
                createFolder();
              }
            }}
          />
          <Button
            onClick={() => createFolder()}
            disabled={!newFolderName.trim() || isCreatingFolder}
          >
            Create
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setShowNewFolderInput(false);
              setNewFolderName("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <div className="hidden w-72 shrink-0 lg:block">
          <FolderTree
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {folders.length} folder{folders.length === 1 ? "" : "s"},{" "}
              {files.length} file{files.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {isFetching ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                    : "space-y-2",
                )}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : folders.length === 0 && files.length === 0 ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
                <Folder className="h-12 w-12" />
                <p className="font-medium">This folder is empty</p>
                <p className="text-sm">Upload files or create a subfolder.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {folders.map((folder) => (
                  <button
                    key={`folder-${folder.id}`}
                    type="button"
                    onDoubleClick={() => handleOpenFolder(folder)}
                    onClick={() => handleOpenFolder(folder)}
                    className="flex flex-col items-center gap-3 rounded-lg border bg-background p-4 text-left transition-colors hover:bg-accent"
                  >
                    <Folder className="h-10 w-10 text-amber-500" />
                    <div className="w-full text-center">
                      <p className="truncate text-sm font-medium">
                        {folder.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Folder</p>
                    </div>
                  </button>
                ))}

                {files.map((file) => (
                  <div
                    key={`file-${file.id}`}
                    className="group flex flex-col rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
                  >
                    <button
                      type="button"
                      onDoubleClick={() => handleOpenFile(file)}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <FileIcon type={file.mimetype} size={40} />
                      <div className="w-full text-center">
                        <p className="truncate text-sm font-medium">
                          {file.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </button>
                    <div className="mt-3 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={`folder-${folder.id}`}
                    type="button"
                    onDoubleClick={() => handleOpenFolder(folder)}
                    onClick={() => handleOpenFolder(folder)}
                    className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <Folder className="h-5 w-5 text-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">Folder</p>
                    </div>
                  </button>
                ))}

                {files.map((file) => (
                  <div
                    key={`file-${file.id}`}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3"
                  >
                    <FileIcon type={file.mimetype} size={24} />
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleOpenFile(file)}
                        className="truncate text-left font-medium hover:underline"
                      >
                        {file.filename}
                      </button>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} · {file.mimetype}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadDialog}
    </div>
  );
}
