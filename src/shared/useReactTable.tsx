import { type Icon, type IconProps, IconSelector } from "@tabler/icons-react";
import {
    useMantineReactTable,
    type MRT_TableOptions,
    type MRT_RowData,
} from "mantine-react-table";

import type { JSX, RefAttributes } from "react";

export function useReactTable<TData extends MRT_RowData>(
    tableOptions: MRT_TableOptions<TData>,
) {
    return useMantineReactTable<TData>({
        enableColumnOrdering: true,
        enableGlobalFilter: false,
        enableColumnActions: false,
        enableRowActions: true,
        positionActionsColumn: "last",
        paginationDisplayMode: "pages",
        enableColumnDragging: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableHiding: false,
        filterFromLeafRows: false,
        enableTopToolbar: false,
        icons: {
            ...tableOptions.icons,
            IconSortAscending: (
                props: JSX.IntrinsicAttributes & IconProps & RefAttributes<Icon>,
            ) => <IconSelector {...props} />,
            IconSortDescending: (
                props: JSX.IntrinsicAttributes & IconProps & RefAttributes<Icon>,
            ) => <IconSelector {...props} />,
            IconArrowsSort: (
                props: JSX.IntrinsicAttributes & IconProps & RefAttributes<Icon>,
            ) => <IconSelector {...props} />,
        },
        initialState: { ...tableOptions.initialState, density: "xs" },
        displayColumnDefOptions: {
            "mrt-row-actions": {
                size: 30, // узкая колонка
                maxSize: 80,
            },
        },
        ...tableOptions,
    });
}