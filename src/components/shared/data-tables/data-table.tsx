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
  type Table as TanstackTable,
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
import { DataTableConfig } from "./types";
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
  customContent?: React.ReactNode | ((table: TanstackTable<TData>) => React.ReactNode);
  customTable?: React.ReactNode | ((table: TanstackTable<TData>) => React.ReactNode);
}

export function DataTable<TData, TValue>({
  className,
  containerClassName,
  columns,
  data,
  context,
  footerPagination = true,
  isPending,
  customContent,
  customTable,
}: DataTableProps<TData, TValue>) {
  const injectedContent =
    customContent ??
    customTable ??
    context?.customContent ??
    context?.customTable;

  //set pagination in footer
  const { setContent } = useFooter();
  const { t } = useTranslation("common");

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

  React.useEffect(() => {
    if (footerPagination && !injectedContent) {
      setContent?.(
        <DataTablePagination
          table={table}
          context={context}
          className="px-10"
        />
      );
    } else {
      setContent?.(null);
    }
    return () => {
      setContent?.(null);
    };
  }, [footerPagination, injectedContent, context, setContent, table]);

  return (
    <div className={cn(className, "space-y-4")}>
      <DataTableToolbar
        table={table}
        context={context}
        hideViewOptions={Boolean(injectedContent)}
      />
      {injectedContent ? (
        typeof injectedContent === "function" ? (
          injectedContent(table)
        ) : (
          injectedContent
        )
      ) : (
        <div className={cn("rounded-md", containerClassName)}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-xs"
                      >
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
      )}
      {!footerPagination && !injectedContent && (
        <DataTablePagination table={table} context={context} />
      )}
    </div>
  );
}
