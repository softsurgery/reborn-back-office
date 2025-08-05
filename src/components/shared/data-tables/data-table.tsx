import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageOpen } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";
import { DataTableConfig } from "@/types";
import { useFooter } from "@/contexts/FooterContext";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData, TValue> {
  className?: string;
  containerClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  context: DataTableConfig<TData>;
  footerPagination?: boolean;
  isPending: boolean;
}

export function DataTable<TData, TValue>({
  className,
  containerClassName,
  columns,
  data,
  context,
  footerPagination = true,
  isPending,
}: DataTableProps<TData, TValue>) {
  //set pagination in footer
  const { setContent } = useFooter();
  const { t } = useTranslation("common");
  React.useEffect(() => {
    if (footerPagination)
      setContent?.(
        <DataTablePagination
          table={table}
          context={context}
          className="px-10"
        />
      );
    return () => {
      setContent?.(null);
    };
  }, [footerPagination, context.totalPageCount, context.size, context.page]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      Object.fromEntries(
        context?.invisibleColumns?.map((column) => [column, false]) || []
      )
    );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });
  return (
    <div className={cn(className, "space-y-4")}>
      <DataTableToolbar table={table} context={context} />
      <div className={cn("rounded-md", containerClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length && !isPending ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1 px-2 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {t("common.table.noResults")} <PackageOpen />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center "
                >
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {t("common.table.loading")} <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!footerPagination && (
        <DataTablePagination table={table} context={context} />
      )}
    </div>
  );
}
