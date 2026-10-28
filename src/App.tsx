import { useState } from 'react';
import { GameScreen } from '@/components/game/GameScreen';
import { SetupScreen } from '@/components/game/SetupScreen';
import type { GameConfig } from '@/game/types';

function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);

  if (!config) {
    return <SetupScreen onStart={setConfig} />;
  }
  return <GameScreen config={config} />;
}

export default App;
