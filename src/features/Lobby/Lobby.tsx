import { type FC, useLayoutEffect } from "react";
import { useLobbyStore } from "./lobby.store.ts";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Center,
  Group,
  Select,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { type Player, usePlayerStore } from "../../entitity/Player";
import { Team } from "./Team.tsx";
import clsx from "clsx";

type LobbyProps = {
  className?: string;
};

export const Lobby: FC<LobbyProps> = ({ className }) => {
  const players = usePlayerStore((state) => state.players);
  const lobbies = useLobbyStore((state) => state.lobbies);
  const generateLobbies = useLobbyStore((state) => state.generateLobbies);
  const generateTeams = useLobbyStore((state) => state.generateTeams);
  const teams = useLobbyStore((state) => state.teams);
  const chillZone = useLobbyStore((state) => state.chillZone);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    generateLobbies(players);
    generateTeams();
  }, []);

  const handleNextRound = () => {
    navigate("/");

    // setPlayers here
  };

  const handleWinnerChange = (val: string) => {
    console.log(val);
  };

  const renderPlayerTable = (data: Player[], prefix: string) => (
    <Table striped highlightOnHover verticalSpacing="md">
      <Table.Thead className="text-center">
        <Table.Tr>
          <Table.Th>№</Table.Th>
          <Table.Th>Никнейм</Table.Th>
          <Table.Th>MMR</Table.Th>
          <Table.Th>Роль</Table.Th>
          <Table.Th>Кол-во жизней</Table.Th>
          <Table.Th>Chill Zone</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody className="text-center">
        {data.map((player, i) => {
          const safeId = player.id || `${prefix}-${i}`;
          return (
            <Table.Tr
              key={`${prefix}-${safeId}`}
              style={{
                opacity: (player.lives ?? 0) <= 0 ? 0.5 : 1,
                backgroundColor:
                  (player.lives ?? 0) <= 0 ? "#f8d7da" : "transparent",
              }}
            >
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{player.nickname}</Table.Td>
              <Table.Td>{player.mmr}</Table.Td>
              <Table.Td>{player.role}</Table.Td>
              <Table.Td>{player.lives}</Table.Td>
              <Table.Td>{player.chillZoneValue}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );

  return (
    <div className={clsx("p-6 max-w-6xl mx-auto", className)}>
      <Title order={2} className="mb-6">
        Лобби турнира
      </Title>

      <Stack>
        {lobbies.map((lobby, idx) => {
          const lobbyKey = `lobby-${idx}`;
          return (
            <Card key={lobbyKey} shadow="sm" padding="md" radius="md">
              <Group align="flex-start">
                <div className="flex-1">
                  <Title order={4}>Лобби {idx + 1}</Title>
                  {renderPlayerTable(lobby, lobbyKey)}
                </div>
                <div className="flex-1">
                  <Title order={4}>Формирование команд</Title>\
                  <Team
                    team={teams?.[lobbyKey]}
                    lobbyKey={lobbyKey}
                    players={lobby}
                  />
                  <Group align="center">
                    <span>Победила:</span>
                    <Select
                      data={[
                        { value: "team1", label: "Команда 1" },
                        { value: "team2", label: "Команда 2" },
                      ]}
                      value={teams?.[lobbyKey]?.winner || ""}
                      onChange={(val) =>
                        handleWinnerChange(val as "team1" | "team2")
                      }
                    />
                  </Group>
                </div>
              </Group>
            </Card>
          );
        })}

        {chillZone.length > 0 && (
          <Card shadow="sm" padding="md" radius="md">
            <Title order={4} className="mb-2">
              Chill Zone
            </Title>
            {renderPlayerTable(chillZone, "chill")}
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
