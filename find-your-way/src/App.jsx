import './App.css';
import { useGameState } from './hooks/useGameState';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import FinalScreen from './components/FinalScreen';

export default function App() {
  const { screen, team, completed, timeLeft, xpPopups, startGame, completeStation, resetGame, totalXP } = useGameState();

  if (screen === 'setup') return <SetupScreen onStart={startGame} />;
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
