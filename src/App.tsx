/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { SkillTree } from './components/SkillTree';
import { useGameLoop } from './hooks/useGameLoop';

export default function App() {
  useGameLoop();

  useEffect(() => {
    // Prevent default touch behaviors for mobile app feel
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);
    
    return () => {
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-white overflow-hidden select-none touch-none">
      <GameCanvas />
      <HUD />
      <SkillTree />
    </div>
  );
}
