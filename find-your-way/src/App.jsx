import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';
import AdminPage from './pages/AdminPage';

function GameApp() {
  const { screen, team, completed, timeLeft, timerRunning, xpPopups, error, startGame, completeStation, resetGame, totalXP } = useGameState();

  if (screen === 'setup') return <SetupScreen onStart={startGame} error={error} />;
  if (screen === 'final') return <FinalScreen team={team} completed={completed} totalXP={totalXP} onReset={resetGame} />;
  return (
    <GameScreen
      team={team}
      completed={completed}
      timeLeft={timeLeft}
      xpPopups={xpPopups}
      onComplete={completeStation}
      onReset={resetGame}
      totalXP={totalXP}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<GameApp />} />
      </Routes>
    </BrowserRouter>
  );
}
