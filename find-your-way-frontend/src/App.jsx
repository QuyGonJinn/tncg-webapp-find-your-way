import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';
import PinDisplay from './components/PinDisplay';
import WaitingRoom from './components/WaitingRoom';
import AdminPage from './pages/AdminPage';
import ControlPage from './pages/ControlPage';
import WortDesGlaubensPage from './pages/WortDesGlaubensPage';
import BibelposePage from './pages/BibelposePage';
import HeiligeBuchstabenjagdPage from './pages/HeiligeBuchstabenjagdPage';

function GameApp() {
  const { screen, setScreen, team, completed, pending, timeLeft, timerRunning, xpPopups, error, startGame, loginGame, completeStation, resetGame, totalXP, waitingRoomEnabled } = useGameState();

  if (screen === 'welcome') return <WelcomeScreen onContinue={() => setScreen('setup')} />;
  if (screen === 'setup') return <SetupScreen onStart={startGame} onLogin={loginGame} error={error} />;
  if (screen === 'pin') return <PinDisplay pin={team?.pin} onContinue={() => setScreen('game')} />;
  if (screen === 'waiting' || (waitingRoomEnabled && screen === 'game')) return <WaitingRoom team={team} onGameStart={() => setScreen('game')} />;
  if (screen === 'final') return <FinalScreen team={team} completed={completed} totalXP={totalXP} onReset={resetGame} />;
  return (
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="/wort-des-glaubens" element={<WortDesGlaubensPage />} />
        <Route path="/bibelpose" element={<BibelposePage />} />
        <Route path="/heilige-buchstabenjagd" element={<HeiligeBuchstabenjagdPage />} />
        <Route path="*" element={<GameApp />} />
      </Routes>
    </BrowserRouter>
  );
}
