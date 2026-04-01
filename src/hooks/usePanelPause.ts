import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function usePanelPause(isOpen: boolean) {
  const panelOpened = useGameStore(s => s.panelOpened);
  const panelClosed = useGameStore(s => s.panelClosed);

  useEffect(() => {
    if (isOpen) {
      panelOpened();
      return () => panelClosed();
    }
  }, [isOpen, panelOpened, panelClosed]);
}
