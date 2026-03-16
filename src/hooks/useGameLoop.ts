import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== 0) {
        const delta = (time - lastTimeRef.current) / 1000;
        // Cap delta to prevent huge jumps if tab is inactive
        const cappedDelta = Math.min(delta, 0.1);
        useGameStore.getState().tick(cappedDelta, window.innerWidth, window.innerHeight);
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
}
