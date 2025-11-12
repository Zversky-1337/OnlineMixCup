import clsx from "clsx";
import { type FC, useMemo } from "react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useReactTable } from "../../shared/useReactTable";
import { AddPlayer, type Player, usePlayerStore } from "../../entitity/Player";
import { Title } from "@mantine/core";

type TournamentTableProps = {
  className?: string;
};

export const TournamentTable: FC<TournamentTableProps> = ({ className }) => {
  const playerList = usePlayerStore((s) => s.players);
  const setPlayer = usePlayerStore((s) => s.setPlayers);

  const columns = useMemo<MRT_ColumnDef<Player>[]>(
    () => [
      {
        id: "rowNumber",
        header: "№",
        enableEditing: false,
        Cell: ({ row, table }) =>
          table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1,
        enableColumnFilter: false,
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "nickname",
        header: "Никнейм",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        mantineEditTextInputProps: ({ row }) => ({
          type: "nickname",
          required: true,
          onBlur: (event) => {
            const value = event.target.value;
            setPlayer({ ...row.original, nickname: value });
          },
        }),
      },
      {
        accessorKey: "mmr",
        header: "MMR",
        filterFn: "contains",
        sortingFn: "alphanumeric",
        mantineEditTextInputProps: ({ row }) => ({
          type: "mmr",
          required: true,
          onBlur: (event) => {
            const value = event.target.value;
            setPlayer({ ...row.original, mmr: Number(value) });
          },
        }),
      },
      {
        accessorKey: "role",
        header: "Роль",
        filterFn: "contains",
        sortingFn: "alphanumeric",
        mantineEditTextInputProps: ({ row }) => ({
          type: "role",
          required: true,
          onBlur: (event) => {
            const value = event.target.value;
            setPlayer({ ...row.original, role: value });
          },
        }),
      },
      {
        accessorKey: "chillZoneValue",
        header: "Chill Zone",
        filterFn: "contains",
        sortingFn: "alphanumeric",
        mantineEditTextInputProps: ({ row }) => ({
          type: "chillZoneValue",
          required: true,
          onBlur: (event) => {
            const value = event.target.value;
            setPlayer({
              ...row.original,
              chillZoneValue: Number(value),
            });
          },
        }),
      },
      {
        accessorKey: "lives",
        header: "Жизни",
        filterFn: "contains",
        sortingFn: "alphanumeric",
        mantineEditTextInputProps: ({ row }) => ({
          type: "lives",
          required: true,
          onBlur: (event) => {
            const value = event.target.value;
            setPlayer({ ...row.original, lives: Number(value) });
          },
        }),
      },
    ],
    [setPlayer],
  );

  const table = useReactTable({
    columns,
    data: playerList,
    createDisplayMode: "row",
    editDisplayMode: "table",
    enableEditing: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableRowActions: false,
    defaultColumn: {
      minSize: 100,
      size: 250,
      maxSize: 250,
    },
  });

  return (
    <div className={clsx("", className)}>
      <div className="flex items-center justify-between mb-4">
        <Title order={2} c="white">
          Турнирная таблица
        </Title>
        <AddPlayer />
      </div>
      <MantineReactTable table={table} />
    </div>
  );
};
