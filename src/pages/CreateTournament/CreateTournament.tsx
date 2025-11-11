import React, { useState } from "react";
import PlayerTable from "../../components/PlayerTable/PlayerTable";
import { useTournamentStore } from "../../store/tournamentStore";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Select, Group, Title, Center } from "@mantine/core";

const CreateTournament: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lives = useTournamentStore((state) => state.lives);
  const setLives = useTournamentStore((state) => state.setLives);
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStart = () => {
    const filteredPlayers = players
      .filter((p) => p.nickname || p.mmr || p.role)
      .map((p) => ({
        ...p,
        chillZone: 0,
      }));

    setPlayers(filteredPlayers);
    closeModal();
    navigate("/tournament");
  };

  const handleClear = () => {
    if (window.confirm("Вы уверены, что хотите очистить всех участников?")) {
      setPlayers([
        {
          id: crypto.randomUUID(),
          nickname: "",
          mmr: "",
          role: "",
          ready: false,
          chillZone: 0,
        },
      ]);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title order={2}>Создать турнир</Title>
        <Button color="red" variant="outline" onClick={handleClear}>
          Очистить
        </Button>
      </div>

      {/* Player Table */}
      <div className="mb-6">
        <PlayerTable />
      </div>

      {/* Create Button */}
      <Center className="mb-6">
        <Button onClick={openModal}>Создать</Button>
      </Center>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title="Выберите количество жизней"
        centered
      >
        <Select
          value={lives.toString()}
          onChange={(value) => setLives(Number(value))}
          data={["1", "2", "3", "4", "5"]}
          label="Жизни"
        />
        <Group position="apart" mt="xl">
          <Button color="green" onClick={handleStart}>
            Начать турнир
          </Button>
          <Button variant="outline" color="gray" onClick={closeModal}>
            Закрыть
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default CreateTournament;
