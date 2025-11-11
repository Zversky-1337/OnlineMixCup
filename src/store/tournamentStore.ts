import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Player {
  id: string;
  nickname: string;
  mmr: string;
  role: string;
  ready: boolean;
  chillZone: number;
}

export interface PlayerWithLives extends Player {
  currentLives: number;
}

interface TournamentState {
  players: PlayerWithLives[];
  lives: number;
  chillZoneTemp: PlayerWithLives[];
  setPlayers: (players: PlayerWithLives[]) => void;
  setLives: (lives: number) => void;
  setChillZoneTemp: (players: PlayerWithLives[]) => void;
  generateLobbies: (playersList?: PlayerWithLives[]) => {
    lobbies: PlayerWithLives[][];
    remaining: PlayerWithLives[];
  };
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      players: [],
      lives: 2,
      chillZoneTemp: [],

      setPlayers: (players) => set({ players }),
      setLives: (lives) => set({ lives }),
      setChillZoneTemp: (players) => set({ chillZoneTemp: players }),

      generateLobbies: (playersList?: PlayerWithLives[]) => {
        const allPlayers = playersList ?? get().players;

        // ✅ Берём только живых игроков для генерации лобби
        const alivePlayers = allPlayers.filter(
          (p) => (p.currentLives ?? get().lives) > 0,
        );

        // убираем "пустые строки"
        const filtered = alivePlayers.filter(
          (p) => p.nickname || p.mmr || p.role,
        );

        const shuffle = <T>(arr: T[]): T[] =>
          [...arr].sort(() => Math.random() - 0.5);
        const shuffled = shuffle(filtered);

        const totalPlayers = shuffled.length;
        const chillCount = totalPlayers % 10;

        let chillZonePlayers: PlayerWithLives[] = [];
        let lobbyPlayers: PlayerWithLives[] = shuffled;

        if (chillCount > 0) {
          // Выбираем тех, у кого меньше всего chillZone
          const minChill = Math.min(...shuffled.map((p) => p.chillZone));
          const candidates = shuffled.filter((p) => p.chillZone === minChill);

          if (candidates.length > chillCount) {
            chillZonePlayers = shuffle(candidates).slice(0, chillCount);
          } else {
            const remainingNeeded = chillCount - candidates.length;
            const others = shuffled
              .filter((p) => !candidates.includes(p))
              .sort((a, b) => a.chillZone - b.chillZone);
            chillZonePlayers = [
              ...candidates,
              ...others.slice(0, remainingNeeded),
            ];
          }

          lobbyPlayers = shuffled.filter((p) => !chillZonePlayers.includes(p));
        }

        // Разбиваем оставшихся по лобби по 10 человек
        const lobbies: PlayerWithLives[][] = [];
        for (let i = 0; i < lobbyPlayers.length; i += 10) {
          lobbies.push(lobbyPlayers.slice(i, i + 10));
        }

        return { lobbies, remaining: chillZonePlayers };
      },
    }),
    {
      name: "tournament-storage",
      partialize: (state) => ({
        players: state.players,
        lives: state.lives,
        chillZoneTemp: state.chillZoneTemp,
      }),
    },
  ),
);
