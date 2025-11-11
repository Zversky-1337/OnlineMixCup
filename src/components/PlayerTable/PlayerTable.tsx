import React, { useEffect, useRef } from "react";
import { TextInput, Button, Table, Center } from "@mantine/core";
import { useTournamentStore } from "../../store/tournamentStore";

const PlayerTable: React.FC = () => {
  const players = useTournamentStore((s) => s.players);
  const setPlayers = useTournamentStore((s) => s.setPlayers);
  const lives = useTournamentStore((s) => s.lives);
  const getPlayers = useTournamentStore.getState; // <-- доступ к актуальному состоянию

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Добавление нового игрока
  const handleAddPlayer = () => {
    const current = getPlayers().players;
    const newPlayer = {
      id: crypto.randomUUID(),
      nickname: "",
      mmr: "3000",
      role: "1-2-3-4-5",
      ready: false,
      chillZone: 0,
      currentLives: lives,
    };
    setPlayers([...current, newPlayer]);
  };

  const handleTextChange = (
    id: string,
    field: "nickname" | "mmr" | "role",
    value: string,
  ) => {
    const current = getPlayers().players;
    const updatedPlayers = current.map((p) =>
      p.id === id ? { ...p, [field]: value } : p,
    );
    setPlayers(updatedPlayers);

    // авто-добавление новой строки
    if (field === "nickname") {
      const lastPlayer = updatedPlayers[updatedPlayers.length - 1];
      if (id === lastPlayer.id) {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
          const check = getPlayers().players.at(-1);
          if (check && check.nickname.trim() !== "") {
            handleAddPlayer();
          }
        }, 500);
      }
    }
  };

  const handleReadyToggle = (id: string) => {
    const current = getPlayers().players;
    const updated = current.map((p) =>
      p.id === id
        ? {
            ...p,
            ready: !p.ready,
            currentLives: !p.ready
              ? p.currentLives
              : Math.max(0, p.currentLives - 1),
          }
        : p,
    );
    setPlayers(updated);
  };

  useEffect(() => {
    if (players.length === 0) {
      handleAddPlayer();
    }
  }, []);

  return (
    <div className="p-6">
      <Center>
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          className="text-center"
        >
          <thead className="text-lg">
            <tr>
              <th>№</th>
              <th>Никнейм</th>
              <th>MMR</th>
              <th>Роль</th>
              <th>Готов</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(players) &&
              players.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <TextInput
                      size="md"
                      value={row.nickname}
                      onChange={(e) =>
                        handleTextChange(row.id, "nickname", e.target.value)
                      }
                      styles={{ input: { textAlign: "center", fontSize: 16 } }}
                    />
                  </td>
                  <td>
                    <TextInput
                      size="md"
                      value={row.mmr}
                      onChange={(e) =>
                        handleTextChange(row.id, "mmr", e.target.value)
                      }
                      styles={{ input: { textAlign: "center", fontSize: 16 } }}
                    />
                  </td>
                  <td>
                    <TextInput
                      size="md"
                      value={row.role}
                      onChange={(e) =>
                        handleTextChange(row.id, "role", e.target.value)
                      }
                      styles={{ input: { textAlign: "center", fontSize: 16 } }}
                    />
                  </td>
                  <td>
                    <Button
                      variant={row.ready ? "filled" : "outline"}
                      color={row.ready ? "green" : "red"}
                      size="md"
                      onClick={() => handleReadyToggle(row.id)}
                    >
                      {row.ready ? "✔️" : "❌"}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Center>
    </div>
  );
};

export default PlayerTable;
