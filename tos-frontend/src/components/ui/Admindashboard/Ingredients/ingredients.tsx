"use client"

import { useEffect, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Pencil, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddIngredientDialog } from "@/components/ui/Admindashboard/Ingredients/add-ingridients"
import { EditIngredientDialog } from "@/components/ui/Admindashboard/Ingredients/edit-ingredients"
import { Ingredient, useIngredientStore } from "@/Store/useingredientsStore"
import { cn } from "@/lib/utils"



export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stockLevel.unit",
    header: "Current Stock",
    cell: ({ row }) => {
      const stockLevel = row.original.stockLevel;
      return (
        <div>
          {stockLevel.unit.$numberDecimal} {stockLevel.unitSymbol}
        </div>
      );
    },
  },
  {
    accessorKey: "stockLevel.warningLevel",
    header: "Warning Level",
    cell: ({ row }) => {
      const stockLevel = row.original.stockLevel;
      return (
        <div>
          {stockLevel.warningLevel?.$numberDecimal || 0} {stockLevel.unitSymbol}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { unit, warningLevel } = row.original.stockLevel;
      const unitValue = Number(unit.$numberDecimal);
      const warningValue = Number(warningLevel?.$numberDecimal || 0);
      const status = unitValue === 0 ? "out" : unitValue <= warningValue ? "low" : "in";

      return (
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium w-fit",
            status === "out" && "bg-red-100 text-red-700",
            status === "low" && "bg-yellow-100 text-yellow-700",
            status === "in" && "bg-green-100 text-green-700"
          )}
        >
          {status === "out" && "OUT OF STOCK"}
          {status === "low" && "LOW STOCK"}
          {status === "in" && "IN STOCK"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ingredient = row.original;
      const { deleteIngredient } = useIngredientStore.getState();

      return (
        <div className="flex items-center gap-2">
          <EditIngredientDialog ingredient={ingredient} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteIngredient(ingredient._id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
// export const columns: ColumnDef<Ingredient>[] = [
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
//   {
//     accessorKey: "unit",
//     header: "Current Stock",
//     cell: ({ row }) => (
//       <div>
//         {row.getValue("unit")} {row.original.unitSymbol}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "warningLevel",
//     header: "Warning Level",
//     cell: ({ row }) => (
//       <div>
//         {row.getValue("warningLevel")} {row.original.unitSymbol}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const unit = row.original.unit
//       const warningLevel = row.original.warningLevel
//       const status = unit === 0 ? "out" : unit <= warningLevel ? "low" : "in"
//
//       return (
//         <div className={cn(
//           "px-2 py-1 rounded-full text-xs font-medium w-fit",
//           status === "out" && "bg-red-100 text-red-700",
//           status === "low" && "bg-yellow-100 text-yellow-700",
//           status === "in" && "bg-green-100 text-green-700"
//         )}>
//           {status === "out" && "OUT OF STOCK"}
//           {status === "low" && "LOW STOCK"}
//           {status === "in" && "IN STOCK"}
//         </div>
//       )
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const ingredient = row.original
//       const { deleteIngredient } = useIngredientStore.getState()
//
//       return (
//         <div className="flex items-center gap-2">
//           <EditIngredientDialog ingredient={ingredient} />
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => deleteIngredient(ingredient.id)}
//           >
//             <Trash2 className="h-4 w-4 text-red-500" />
//           </Button>
//         </div>
//       )
//     },
//   },
// ]

export function Ingredients() {
  const { ingredients, fetchIngredients, isLoading, error } = useIngredientStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    fetchIngredients()
  }, [fetchIngredients])

  const table = useReactTable({
    data: ingredients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Ingredient Stock</h1>
        <AddIngredientDialog />
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter ingredients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No ingredients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

