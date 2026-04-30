import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';
import PinDisplay from './components/PinDisplay';
import ReminderBox from './components/ReminderBox';
import AdminPage from './pages/AdminPage';
import ControlPage from './pages/ControlPage';

function GameApp() {
  const { screen, setScreen, team, completed, pending, timeLeft, timerRunning, xpPopups, reminder, error, startGame, loginGame, completeStation, resetGame, totalXP } = useGameState();

  if (screen === 'setup') return <SetupScreen onStart={startGame} onLogin={loginGame} error={error} />;
  if (screen === 'pin') return <PinDisplay pin={team?.pin} onContinue={() => setScreen('game')} />;
  if (screen === 'final') return <FinalScreen team={team} completed={completed} totalXP={totalXP} onReset={resetGame} />;
  return (
    <>
      <ReminderBox reminder={reminder} />
      <GameScreen
        team={team}
        completed={completed}
        pending={pending}
        timeLeft={timeLeft}
        xpPopups={xpPopups}
        onComplete={completeStation}
        onReset={resetGame}
        totalXP={totalXP}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="*" element={<GameApp />} />
      </Routes>
    </BrowserRouter>
  );
}
