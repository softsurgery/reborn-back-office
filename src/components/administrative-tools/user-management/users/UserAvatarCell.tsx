import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { DataTableCellVariant } from "@/types";

const UserAvatarCell = React.memo(
  ({ pictureId, fallback }: { pictureId?: number; fallback?: string }) => {
    const { data: url } = useQuery({
      queryKey: ["profile-picture", pictureId],
      queryFn: () => api.upload.getUploadById(pictureId!),
      enabled: !!pictureId,
      staleTime: Infinity,
    });

    return (
      <DataTableCell
        variant={DataTableCellVariant.AVATAR}
        value={{ url, fallback }}
        className="my-2 w-14 h-14 bg-muted border-2"
      />
    );
  }
);

UserAvatarCell.displayName = "UserAvatarCell";

export default UserAvatarCell;
