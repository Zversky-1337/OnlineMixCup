import clsx from "clsx";
import type { FC } from "react";
import { Button } from "@mantine/core";
import { usePlayerStore } from "./player.store";
import type { Player } from "./types.ts";

type AddPlayerProps = {
  className?: string;
};

export const AddPlayer: FC<AddPlayerProps> = ({ className }) => {
  const addPlayer = usePlayerStore((state) => state.addPlayer);

  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      nickname: "Nickname",
      mmr: 3000,
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
