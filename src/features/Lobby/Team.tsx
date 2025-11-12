import { type FC, useMemo } from "react";
import { Select, Stack, Table } from "@mantine/core";
import { type LobbyTeams, useLobbyStore } from "./lobby.store";
import type { Player } from "../../entitity/Player";

type TeamProps = {
  lobbyKey: string;
  team?: LobbyTeams;
  players: Player[];
};

export const Team: FC<TeamProps> = ({ lobbyKey, team, players }) => {
  const setTeam = useLobbyStore((state) => state.setTeam);

  const validPlayerForSelect = useMemo(() => {
    return players.filter((p) => {
      const inFistTeam = team?.team1.find((tp) => tp.id === p.id);
      const inSecondTeam = team?.team2.find((tp) => tp.id === p.id);

      return !inFistTeam && !inSecondTeam;
    });
  }, [team]);

  const options = validPlayerForSelect.map((p) => ({
    label: p.nickname,
    value: p.id,
  }));

  const handleSelectChange = (
    team: "team1" | "team2",
    playerId: string | null,
  ) => {
    const player = validPlayerForSelect.find((p) => p.id === playerId);
    if (!player) return;

    setTeam(lobbyKey, team, player);
  };

  return (
    <Stack mt="sm">
      <Table striped highlightOnHover verticalSpacing="md">
        <thead className="text-center">
          <tr>
            <th>Команда 1</th>
            <th>Команда 2</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={`${lobbyKey}-team-${i}`}>
              <td>
                <Select
                  data={options}
                  value={team?.team1[i]?.id || ""}
                  onChange={(val) => handleSelectChange("team1", val)}
                  disabled={i === 0}
                />
              </td>
              <td>
                <Select
                  data={options}
                  value={team?.team2[i]?.id || ""}
                  onChange={(val) => handleSelectChange("team1", val)}
                  disabled={i === 0}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
};
