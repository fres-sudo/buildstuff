import * as React from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
	table: TanstackTable<TData>;
	floatingBar?: React.ReactNode | null;
}

export function DataTable<TData>({
	table,
	floatingBar,
	className,
	...props
}: DataTableProps<TData>) {
	const queryClient = useQueryClient();

	// Memoize row selection to prevent unnecessary re-renders
	const memoizedRowSelection = React.useMemo(() => {
		return table.getState().rowSelection;
	}, [table.getState().rowSelection]);

	// Use useCallback to memoize the row selection handler
	const handleRowSelectionChange = React.useCallback(
		(rowId: string, checked: boolean) => {
			table.setRowSelection((prev) => ({
				...prev,
				[rowId]: checked,
			}));
			// Manually update the queryClient cache to avoid a full refetch
			queryClient.setQueryData(["todos"], (oldData: any) => {
				if (oldData) {
					return {
						...oldData,
						rows: oldData.rows.map((row: any) =>
							row.id === rowId ? { ...row, selected: checked } : row
						),
					};
				}
				return oldData;
			});
		},
		[table, queryClient]
	);

	return (
		<div
			className={cn("space-y-4", className)}
			{...props}>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										style={getCommonPinningStyles(header)}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										style={getCommonPinningStyles(cell)}>
										{flexRender(cell.column.columnDef.cell, {
											...cell.getContext(),
											onRowSelectionChange: handleRowSelectionChange,
										})}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
			{floatingBar}
		</div>
	);
}
