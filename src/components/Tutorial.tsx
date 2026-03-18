import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

const STEPS = [
  { text: "This is your Blob! It eats food to grow.", position: 'center' as const, autoAdvance: 3000 },
  { text: "Tap the screen to drop food for your Blob!", position: 'center' as const },
  { text: "Earn money by eating. Open the Skill Tree to power up!", position: 'bottom-right' as const },
  { text: "Buy an upgrade to make your Blob stronger!", position: 'center' as const },
  { text: "Keep growing and evolving to unlock new worlds!", position: 'center' as const, autoAdvance: 3000 },
];

export function Tutorial() {
  const tutorialStep = useGameStore(s => s.tutorialStep);
  const tutorialComplete = useGameStore(s => s.tutorialComplete);
  const advanceTutorial = useGameStore(s => s.advanceTutorial);
  const completeTutorial = useGameStore(s => s.completeTutorial);

  const step = STEPS[tutorialStep];
  const isVisible = !tutorialComplete && tutorialStep < STEPS.length;

  useEffect(() => {
    if (!isVisible || !step?.autoAdvance) return;
    const timer = setTimeout(advanceTutorial, step.autoAdvance);
    return () => clearTimeout(timer);
  }, [tutorialStep, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={tutorialStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className={`absolute pointer-events-auto ${
          step.position === 'center'
            ? 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'bottom-24 right-24'
        }`}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-5 max-w-xs text-center"
          >
            <div className="text-lg font-bold text-slate-800 mb-3">{step.text}</div>
            <div className="flex gap-2 justify-center">
              {!step.autoAdvance && (
                <button
                  onClick={advanceTutorial}
                  className="px-5 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 active:scale-95 transition-all"
                >
                  {tutorialStep === STEPS.length - 1 ? "Let's Go!" : 'Got it'}
                </button>
              )}
              <button
                onClick={completeTutorial}
                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Skip
              </button>
            </div>
            <div className="flex gap-1 justify-center mt-3">
              {STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                  i <= tutorialStep ? 'bg-blue-500' : 'bg-slate-300'
                }`} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
