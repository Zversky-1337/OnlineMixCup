import React from "react";
import { useTournamentStore } from "../store/tournamentStore.ts";
import { useNavigate } from "react-router-dom";
import { Button, Center } from "@mantine/core";
import { TournamentTable } from "../features/TournamentTable";

const TournamentPage: React.FC = () => {
  const players = useTournamentStore((state) => state.players);
  const setChillZoneTemp = useTournamentStore(
    (state) => state.setChillZoneTemp,
  );

  const generateLobbies = useTournamentStore((state) => state.generateLobbies);
  const navigate = useNavigate();

  const handleGenerateLobbies = () => {
    const alivePlayers = players.filter((p) => (p.currentLives ?? 2) > 0);
    const { remaining } = generateLobbies(alivePlayers);
    setChillZoneTemp(remaining);
    navigate("/lobbies");
  };

  return (
    <div className="p-6 mx-auto">
      <TournamentTable />

      <Center className="mt-6">
        <Button color="blue" size="md" onClick={handleGenerateLobbies}>
          Сгенерировать лобби
        </Button>
      </Center>
    </div>
  );
};

export default TournamentPage;
