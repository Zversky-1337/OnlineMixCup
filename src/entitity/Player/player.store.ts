import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {Player} from "./types.ts";


interface PlayerStoreState {
    players: Player[];
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
    setPlayers: (player: Player) => void; // now updates a single player
}

export const usePlayerStore = create<PlayerStoreState>()(
    persist(
        (set, get) => ({
            players: [],
            addPlayer: (player: Player) => set({ players:[ ...get().players, player] }),
            // update single player by id
            setPlayers: (player: Player) => set({ players: get().players.map(p => p.id === player.id ? player : p) }),
            removePlayer: (playerId: string) => set({ players: get().players.filter(p => p.id !== playerId) }),
        }),
        {
            name: "player-storage",
            partialize: (state) => ({
                players: state.players,
            }),
        },
    ),
);
