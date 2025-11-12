// deprecated

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournamentStore } from "../../store/tournamentStore";
import type { PlayerWithLives } from "../../store/tournamentStore";
import {
  Table,
  Select,
  Button,
  Group,
  Title,
  Center,
  Card,
  Stack,
} from "@mantine/core";

interface TeamSelections {
  [lobbyKey: string]: {
    team1: string[];
    team2: string[];
    winner?: "team1" | "team2";
  };
}

const LobbyPage: React.FC = () => {
  const generateLobbies = useTournamentStore((state) => state.generateLobbies);
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const chillZoneTemp = useTournamentStore((state) => state.chillZoneTemp);
  const setChillZoneTemp = useTournamentStore(
    (state) => state.setChillZoneTemp,
  );

  const [lobbies, setLobbies] = useState<PlayerWithLives[][]>([]);
  const [teamSelections, setTeamSelections] = useState<TeamSelections>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Обновляем игроков, добавляем defaults
    const updatedPlayers: PlayerWithLives[] = players.map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
      currentLives: typeof p.currentLives === "number" ? p.currentLives : 2,
      chillZone: typeof p.chillZone === "number" ? p.chillZone : 0,
      nickname: p.nickname ?? "",
      mmr: p.mmr ?? "",
      role: p.role ?? "",
    }));

    setPlayers(updatedPlayers);

    const alivePlayers = updatedPlayers.filter(
      (p) => (p.currentLives ?? 2) > 0,
    );

    const { lobbies, remaining } = generateLobbies(alivePlayers);
    setChillZoneTemp(remaining);
    setLobbies(lobbies);

    // Инициализация команд
    const initialSelections: TeamSelections = {};
    lobbies.forEach((lobby, idx) => {
      const lobbyKey = `lobby-${idx}`;
      const sortedByMMR = [...lobby].sort(
        (a, b) => Number(b.mmr) - Number(a.mmr),
      );
      const topMMR = sortedByMMR[0]?.mmr;
      const topCandidates = sortedByMMR.filter((p) => p.mmr === topMMR);
      const captain1 =
        topCandidates[Math.floor(Math.random() * topCandidates.length)];

      let captain2: PlayerWithLives;
      if (sortedByMMR.length > 1) {
        const remainingCandidates = sortedByMMR.filter(
          (p) => p.id !== captain1.id,
        );
        const secondTopMMR = remainingCandidates[0]?.mmr;
        const secondCandidates = remainingCandidates.filter(
          (p) => p.mmr === secondTopMMR,
        );
        captain2 =
          secondCandidates[Math.floor(Math.random() * secondCandidates.length)];
      } else {
        captain2 = captain1;
      }

      initialSelections[lobbyKey] = {
        team1: [captain1.id, "", "", "", ""],
        team2: [captain2.id, "", "", "", ""],
        winner: undefined,
      };
    });

    setTeamSelections(initialSelections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextRound = () => {
    const chillIds = new Set(chillZoneTemp.map((p) => p.id));

    const updatedPlayers = players.map((player) => {
      let lostLife = false;

      Object.values(teamSelections).forEach(({ team1, team2, winner }) => {
        if (!winner) return;
        const loserTeam = winner === "team1" ? team2 : team1;
        const loserIds = loserTeam
          .filter(Boolean)
          .filter((id) => !chillIds.has(id));
        if (loserIds.includes(player.id)) lostLife = true;
      });

      return lostLife
        ? {
            ...player,
            currentLives: Math.max(0, (player.currentLives ?? 2) - 1),
          }
        : player;
    });

    const finalPlayers = updatedPlayers.map((p) => {
      if ((p.currentLives ?? 0) <= 0) return { ...p, currentLives: 0 };
      if (chillIds.has(p.id))
        return { ...p, chillZone: (p.chillZone ?? 0) + 1 };
      return p;
    });

    setPlayers(finalPlayers);
    setChillZoneTemp([]);
    navigate("/tournament");
  };

  const handleWinnerChange = (lobbyKey: string, winner: "team1" | "team2") => {
    setTeamSelections((prev) => ({
      ...prev,
      [lobbyKey]: { ...prev[lobbyKey], winner },
    }));
  };

  const renderTeamsTable = (lobby: PlayerWithLives[], lobbyKey: string) => {
    const rowsCount = 5;
    const options = lobby.map((p) => ({
      value: p.id,
      label: String(p.nickname || ""),
    }));

    const handleSelectChange = (
      team: "team1" | "team2",
      rowIndex: number,
      playerId: string,
    ) => {
      setTeamSelections((prev) => {
        const updated = { ...prev };
        updated[lobbyKey][team][rowIndex] = playerId;
        return updated;
      });
    };

    const selectedIds = new Set([
      ...(teamSelections[lobbyKey]?.team1 || []),
      ...(teamSelections[lobbyKey]?.team2 || []),
    ]);

    return (
      <Stack spacing="sm" mt="sm">
        <Table striped highlightOnHover verticalSpacing="md" fontSize="md">
          <thead className="text-center">
            <tr>
              <th>Команда 1</th>
              <th>Команда 2</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {Array.from({ length: rowsCount }).map((_, i) => (
              <tr key={`${lobbyKey}-team-${i}`}>
                <td>
                  <Select
                    data={options.filter(
                      (p) =>
                        !selectedIds.has(p.value) ||
                        p.value === teamSelections[lobbyKey]?.team1[i],
                    )}
                    value={teamSelections[lobbyKey]?.team1[i] || ""}
                    onChange={(val) =>
                      handleSelectChange("team1", i, val || "")
                    }
                    disabled={i === 0}
                  />
                </td>
                <td>
                  <Select
                    data={options.filter(
                      (p) =>
                        !selectedIds.has(p.value) ||
                        p.value === teamSelections[lobbyKey]?.team2[i],
                    )}
                    value={teamSelections[lobbyKey]?.team2[i] || ""}
                    onChange={(val) =>
                      handleSelectChange("team2", i, val || "")
                    }
                    disabled={i === 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Group spacing="sm" align="center">
          <span>Победила:</span>
          <Select
            data={[
              { value: "team1", label: "Команда 1" },
              { value: "team2", label: "Команда 2" },
            ]}
            value={teamSelections[lobbyKey]?.winner || ""}
            onChange={(val) =>
              handleWinnerChange(lobbyKey, val as "team1" | "team2")
            }
          />
        </Group>
      </Stack>
    );
  };

  const renderPlayerTable = (data: PlayerWithLives[], prefix: string) => (
    <Table striped highlightOnHover verticalSpacing="md" fontSize="md">
      <thead className="text-center">
        <tr>
          <th>№</th>
          <th>Никнейм</th>
          <th>MMR</th>
          <th>Роль</th>
          <th>Кол-во жизней</th>
          <th>Chill Zone</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {data.map((player, i) => {
          const safeId = player.id || `${prefix}-${i}`;
          return (
            <tr
              key={`${prefix}-${safeId}`}
              style={{
                opacity: (player.currentLives ?? 0) <= 0 ? 0.5 : 1,
                backgroundColor:
                  (player.currentLives ?? 0) <= 0 ? "#f8d7da" : "transparent",
              }}
            >
              <td>{i + 1}</td>
              <td>{player.nickname}</td>
              <td>{player.mmr}</td>
              <td>{player.role}</td>
              <td>{player.currentLives}</td>
              <td>{player.chillZone}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title order={2} className="mb-6">
        Лобби турнира
      </Title>

      <Stack spacing="lg">
        {lobbies.map((lobby, idx) => {
          const lobbyKey = `lobby-${idx}`;
          return (
            <Card key={lobbyKey} shadow="sm" padding="md" radius="md">
              <Group align="flex-start" spacing="xl">
                <div className="flex-1">
                  <Title order={4}>Лобби {idx + 1}</Title>
                  {renderPlayerTable(lobby, lobbyKey)}
                </div>
                <div className="flex-1">
                  <Title order={4}>Формирование команд</Title>
                  {renderTeamsTable(lobby, lobbyKey)}
                </div>
              </Group>
            </Card>
          );
        })}

        {chillZoneTemp.length > 0 && (
          <Card shadow="sm" padding="md" radius="md">
            <Title order={4} className="mb-2">
              Chill Zone
            </Title>
            {renderPlayerTable(chillZoneTemp, "chill")}
          </Card>
        )}
      </Stack>

      <Center mt="xl">
        <Button color="green" size="md" onClick={handleNextRound}>
          Завершить раунд
        </Button>
      </Center>
    </div>
  );
};

export default LobbyPage;
