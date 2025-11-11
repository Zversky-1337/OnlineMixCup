import React, { useState } from "react";
import { useTournamentStore } from "../../store/tournamentStore";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TextInput,
  Button,
  Group,
  Title,
  Center,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { PlayerWithLives } from "../../store/tournamentStore";

const TournamentPage: React.FC = () => {
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const setChillZoneTemp = useTournamentStore(
    (state) => state.setChillZoneTemp,
  );
  const generateLobbies = useTournamentStore((state) => state.generateLobbies);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const filteredPlayers: PlayerWithLives[] = players.filter(
    (p) => p.nickname || p.mmr || p.role,
  );

  const sortedPlayers: PlayerWithLives[] = [...filteredPlayers].sort(
    (a, b) => b.currentLives - a.currentLives,
  );

  const handleGenerateLobbies = () => {
    const alivePlayers = players.filter((p) => (p.currentLives ?? 2) > 0);
    const { remaining } = generateLobbies(alivePlayers);
    setChillZoneTemp(remaining);
    navigate("/lobbies");
  };

  const handleChange = (
    id: string,
    field: keyof PlayerWithLives,
    value: string | number,
  ) => {
    setPlayers(
      players.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                typeof value === "string" && !isNaN(Number(value))
                  ? Number(value)
                  : value,
            }
          : p,
      ),
    );
  };

  const handleAddPlayer = () => {
    const newPlayer: PlayerWithLives = {
      id: crypto.randomUUID(),
      nickname: "Nickname",
      mmr: 3000,
      role: "1-2-3-4-5",
      ready: false,
      chillZone: 0,
      currentLives: 3,
    };

    setPlayers([...players, newPlayer]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Group position="apart" className="mb-6">
        <Title order={2} c="white">
          Турнирная таблица
        </Title>

        <Group>
          {isEditing && (
            <Tooltip label="Добавить нового игрока" withArrow>
              <ActionIcon
                color="green"
                size="lg"
                radius="xl"
                variant="filled"
                onClick={handleAddPlayer}
              >
                <IconPlus size={22} />
              </ActionIcon>
            </Tooltip>
          )}

          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Сохранить" : "Изменить"}
          </Button>
        </Group>
      </Group>

      <Table
        striped
        highlightOnHover
        verticalSpacing="md"
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        <thead
          className="text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
          }}
        >
          <tr>
            <th className="px-4 py-2">№</th>
            <th className="px-4 py-2">Никнейм</th>
            <th className="px-4 py-2">MMR</th>
            <th className="px-4 py-2">Роль</th>
            <th className="px-4 py-2">Кол-во жизней</th>
            <th className="px-4 py-2">Chill Zone</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedPlayers.map((player, index) => {
            const isDead = player.currentLives <= 0;

            return (
              <tr
                key={player.id}
                style={{
                  opacity: isDead ? 0.9 : 1,
                  backgroundColor: isDead
                    ? "rgba(255, 0, 0, 0.18)"
                    : "transparent",
                  color: "#ffffff",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease",
                }}
              >
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <TextInput
                      size="md"
                      value={player.nickname}
                      onChange={(e) =>
                        handleChange(player.id, "nickname", e.target.value)
                      }
                      styles={{
                        input: {
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  ) : (
                    player.nickname
                  )}
                </td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <TextInput
                      size="md"
                      value={String(player.mmr)}
                      onChange={(e) =>
                        handleChange(player.id, "mmr", e.target.value)
                      }
                      styles={{
                        input: {
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  ) : (
                    player.mmr
                  )}
                </td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <TextInput
                      size="md"
                      value={player.role}
                      onChange={(e) =>
                        handleChange(player.id, "role", e.target.value)
                      }
                      styles={{
                        input: {
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  ) : (
                    player.role
                  )}
                </td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <TextInput
                      type="number"
                      min={0}
                      size="md"
                      value={String(player.currentLives)}
                      onChange={(e) =>
                        handleChange(player.id, "currentLives", e.target.value)
                      }
                      styles={{
                        input: {
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  ) : (
                    player.currentLives
                  )}
                </td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <TextInput
                      type="number"
                      min={0}
                      size="md"
                      value={String(player.chillZone)}
                      onChange={(e) =>
                        handleChange(player.id, "chillZone", e.target.value)
                      }
                      styles={{
                        input: {
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  ) : (
                    player.chillZone
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Center className="mt-6">
        <Button color="blue" size="md" onClick={handleGenerateLobbies}>
          Сгенерировать лобби
        </Button>
      </Center>
    </div>
  );
};

export default TournamentPage;
