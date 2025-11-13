import clsx from "clsx";
import type { FC } from "react";
import { Button } from "@mantine/core";
import { usePlayerStore } from "./player.store";
import type { Player } from "./types.ts";

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

type AddPlayerProps = {
  className?: string;
};

export const AddPlayer: FC<AddPlayerProps> = ({ className }) => {
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const players = usePlayerStore((state) => state.players);

  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: generateId(),
      nickname: `Nickname ${players.length + 1}`,
      mmr: Math.floor(Math.random() * (14000 - 1000 + 1)) + 1000,
      role: "1-2-3-4-5",
      chillZoneValue: 0,
      lives: 3,
    };

    addPlayer(newPlayer);
  };

  return (
    <div className={clsx("", className)}>
      <Button onClick={handleAddPlayer}>Add Player</Button>
    </div>
  );
};
