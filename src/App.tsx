import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TournamentPage from "./pages/TournamentPage.tsx";
import { Lobby } from "./features/Lobby";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TournamentPage />} />
        <Route path="/lobbies" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
