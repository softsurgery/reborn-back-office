import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { StorageFolder } from "@/types";
import { api } from "@/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FolderTreeProps {
  selectedFolderId?: number;
  onSelectFolder: (folderId?: number) => void;
}

interface FolderTreeNodeProps {
  folder: StorageFolder;
  selectedFolderId?: number;
  onSelectFolder: (folderId?: number) => void;
  depth?: number;
}

function FolderTreeNode({
  folder,
  selectedFolderId,
  onSelectFolder,
  depth = 0,
}: FolderTreeNodeProps) {
  const hasChildren = Boolean(folder.children?.length);
  const isSelected = selectedFolderId === folder.id;
  const [open, setOpen] = React.useState(depth < 1);

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => onSelectFolder(folder.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
          isSelected && "bg-accent font-medium",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <Folder className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="truncate text-left">{folder.name}</span>
      </button>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className="flex items-center"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-accent"
            aria-label={open ? "Collapse folder" : "Expand folder"}
          >
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CollapsibleTrigger>
        <button
          type="button"
          onClick={() => onSelectFolder(folder.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
            isSelected && "bg-accent font-medium",
          )}
        >
          {open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          <span className="truncate text-left">{folder.name}</span>
        </button>
      </div>
      <CollapsibleContent>
        {folder.children?.map((child) => (
          <FolderTreeNode
            key={child.id}
            folder={child}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FolderTree({
  selectedFolderId,
  onSelectFolder,
}: FolderTreeProps) {
  const { data: folders = [], isLoading } = useQuery({
    queryKey: ["storage-folder-tree"],
    queryFn: () => api.storageFolder.getTree(),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-3 py-2">
        <p className="text-sm font-medium">Folders</p>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <button
          type="button"
          onClick={() => onSelectFolder(undefined)}
          className={cn(
            "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
            selectedFolderId === undefined && "bg-accent font-medium",
          )}
        >
          <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
          <span>All Files</span>
        </button>

        {isLoading ? (
          <div className="space-y-2 px-2 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-7 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : (
          folders.map((folder) => (
            <FolderTreeNode
              key={folder.id}
              folder={folder}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
            />
          ))
        )}
      </div>
    </div>
  );
}
