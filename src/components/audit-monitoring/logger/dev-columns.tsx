import { ColumnDef } from "@tanstack/react-table";
import { DataTableCellVariant, DataTableConfig, ResponseLogDto } from "@/types";
import { Badge } from "@/components/ui/badge";
import { identifyUser } from "@/lib/user.utils";
import { JsonToggler } from "@/components/shared/JsonToggler";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "POST":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "PUT":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "DELETE":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "PATCH":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getDevLoggerColumns = (
  context: DataTableConfig<ResponseLogDto>
): ColumnDef<ResponseLogDto>[] => {
  return [
    {
      accessorKey: "event",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Event"}
          attribute="event"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const event = row?.original?.event;
        return <div>{event}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Method"}
          attribute="method"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const method = row?.original?.method;
        return (
          <Badge className={getMethodColor(method)} variant="secondary">
            {method}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "API Endpoint",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"API Endpoint"}
          attribute="api"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-[10vw] break-words">
            {row?.original?.api}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "User",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User"
          attribute="userId"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-[10vw] break-words">
            {identifyUser(row?.original?.user)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Logged At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Logged At"}
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={date}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "logInfo",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Log Info"}
          attribute="logInfo"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const logInfo = row?.original?.logInfo;
        return logInfo && Object.keys(logInfo).length > 0 ? (
          <JsonToggler data={logInfo} className="w-full" />
        ) : (
          <Badge variant="outline" className="text-xs">
            No data
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
  ];
};
