import { useState } from 'react';
import { GameScreen } from '@/components/game/GameScreen';
import { SetupScreen } from '@/components/game/SetupScreen';

function App() {
  const [playerName, setPlayerName] = useState<string | null>(null);

  if (playerName === null) {
    return <SetupScreen onStart={setPlayerName} />;
  }
  return <GameScreen playerName={playerName} />;
}

export default App;
