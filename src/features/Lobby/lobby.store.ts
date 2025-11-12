import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "../../entitity/Player";

export interface LobbyTeams {
  team1: Player[];
  team2: Player[];
  winner: "team1" | "team2" | null;
}
type Teams = Record<string, LobbyTeams>;

interface LobbyStoreState {
  lobbies: Player[][];
  chillZone: Player[];
  teams: Teams | null;
  generateLobbies: (playersList: Player[]) => void;
  generateTeams: () => void;
  setTeam: (lobbyKey: string, which: "team1" | "team2", player: Player) => void; // changed: single player
}

export const useLobbyStore = create<LobbyStoreState>()(
  persist(
    (set, get) => ({
      lobbies: [],
      chillZone: [],
      teams: null,
      setTeam: (lobbyKey, which, player) =>
        set((state) => {
          if (!state.teams || !state.teams[lobbyKey]) return state; // nothing to update
          const teamData = state.teams[lobbyKey];
          const currentTeam = teamData[which];
          if (currentTeam.some((p) => p.id === player.id)) return state;
          return {
            teams: {
              ...state.teams,
              [lobbyKey]: {
                ...teamData,
                [which]: [...currentTeam, player],
              },
            },
          };
        }),
      generateTeams: () => {
        const lobbies = get().lobbies;
        const newTeams: Teams = {};
        lobbies.forEach((lobby, idx) => {
          const lobbyKey = `lobby-${idx}`;
          if (lobby.length === 0) return; // skip empty lobby

          const sortedByMMR = [...lobby].sort(
            (a, b) => Number(b.mmr) - Number(a.mmr),
          );
          const topMMR = sortedByMMR[0].mmr;
          const topCandidates = sortedByMMR.filter((p) => p.mmr === topMMR);
          const captain1 =
            topCandidates[Math.floor(Math.random() * topCandidates.length)];

          let captain2: Player;
          if (sortedByMMR.length > 1) {
            const remainingCandidates = sortedByMMR.filter(
              (p) => p.id !== captain1.id,
            );
            const secondTopMMR = remainingCandidates[0].mmr;
            const secondCandidates = remainingCandidates.filter(
              (p) => p.mmr === secondTopMMR,
            );
            captain2 =
              secondCandidates[
                Math.floor(Math.random() * secondCandidates.length)
              ];
          } else {
            captain2 = captain1;
          }

          newTeams[lobbyKey] = {
            team1: [captain1],
            team2: [captain2],
            winner: null,
          };
        });
        set({ teams: newTeams });
      },
      generateLobbies: (allPlayers: Player[]) => {
        // ✅ Берём только живых игроков для генерации лобби
        const alivePlayers = allPlayers.filter((p) => p.lives > 0);

        const shuffle = <T>(arr: T[]): T[] =>
          [...arr].sort(() => Math.random() - 0.5);
        const shuffled = shuffle(alivePlayers);

        const totalPlayers = shuffled.length;
        const chillCount = totalPlayers % 10;

        let chillZonePlayers: Player[] = [];
        let lobbyPlayers: Player[] = shuffled;

        if (chillCount > 0) {
          // Выбираем тех, у кого меньше всего chillZone
          const minChill = Math.min(...shuffled.map((p) => p.chillZoneValue));
          const candidates = shuffled.filter(
            (p) => p.chillZoneValue === minChill,
          );

          if (candidates.length > chillCount) {
            chillZonePlayers = shuffle(candidates).slice(0, chillCount);
          } else {
            const remainingNeeded = chillCount - candidates.length;
            const others = shuffled
              .filter((p) => !candidates.includes(p))
              .sort((a, b) => a.chillZoneValue - b.chillZoneValue);
            chillZonePlayers = [
              ...candidates,
              ...others.slice(0, remainingNeeded),
            ];
          }

          lobbyPlayers = shuffled.filter((p) => !chillZonePlayers.includes(p));
        }

        // Разбиваем оставшихся по лобби по 10 человек
        const lobbies: Player[][] = [];
        for (let i = 0; i < lobbyPlayers.length; i += 10) {
          lobbies.push(lobbyPlayers.slice(i, i + 10));
        }

        set({ lobbies: lobbies, chillZone: chillZonePlayers });
      },
    }),
    {
      name: "lobbies-storage",
      partialize: (state) => ({
        lobbies: state.lobbies,
      }),
    },
  ),
);
