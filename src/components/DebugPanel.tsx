import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePanelPause } from '../hooks/usePanelPause';
import { WORLDS } from '../lib/levels';
import { CloseIcon, CaretIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
      >
        {title}
        {open ? <CaretIcon size={16} direction="down" /> : <CaretIcon size={16} direction="right" />}
      </button>
      {open && <div className="p-3 space-y-2.5">{children}</div>}
    </div>
  );
}

function BtnRow({ label, buttons }: { label: string; buttons: { text: string; onClick: () => void }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {buttons.map((b) => (
          <button
            key={b.text}
            onClick={b.onClick}
            className="px-2.5 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-600 active:scale-95 transition-all"
          >
            {b.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DebugPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [jumpLevel, setJumpLevel] = useState('');
  usePanelPause(isOpen);

  const debugAddResources = useGameStore(s => s.debugAddResources);
  const debugFillHunger = useGameStore(s => s.debugFillHunger);
  const debugUnlockAllCosmetics = useGameStore(s => s.debugUnlockAllCosmetics);
  const debugStartBenchmark = useGameStore(s => s.debugStartBenchmark);
  const debugSetLevel = useGameStore(s => s.debugSetLevel);
  const benchmarkActive = useGameStore(s => s._benchmarkActive);

  const handleJump = () => {
    const n = parseInt(jumpLevel, 10);
    if (n > 0) {
      debugSetLevel(n);
      setJumpLevel('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-3xl border-3 border-slate-400 shadow-lg overflow-hidden flex flex-col max-h-[88dvh]"
          >
            <div className="panel-header-game p-4 flex justify-between items-center bg-slate-700 text-white">
              <div>
                <h2 className="text-xl font-black tracking-tight">Debug Tools</h2>
                <div className="text-xs opacity-70 mt-0.5 font-body">Development tools</div>
              </div>
              <button onClick={onClose} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                <CloseIcon size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-3 space-y-3">
              <Section title="Currency Controls">
                <BtnRow
                  label="Money"
                  buttons={[
                    { text: '+$1K', onClick: () => debugAddResources(1000, 0, 0) },
                    { text: '+$10K', onClick: () => debugAddResources(10000, 0, 0) },
                    { text: '+$100K', onClick: () => debugAddResources(100000, 0, 0) },
                    { text: '+$1M', onClick: () => debugAddResources(1000000, 0, 0) },
                  ]}
                />
                <BtnRow
                  label="Gems"
                  buttons={[
                    { text: '+10', onClick: () => debugAddResources(0, 10, 0) },
                    { text: '+50', onClick: () => debugAddResources(0, 50, 0) },
                    { text: '+100', onClick: () => debugAddResources(0, 100, 0) },
                    { text: '+500', onClick: () => debugAddResources(0, 500, 0) },
                  ]}
                />
                <BtnRow
                  label="Essence"
                  buttons={[
                    { text: '+10', onClick: () => debugAddResources(0, 0, 10) },
                    { text: '+50', onClick: () => debugAddResources(0, 0, 50) },
                    { text: '+100', onClick: () => debugAddResources(0, 0, 100) },
                  ]}
                />
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={debugFillHunger}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 active:scale-95 transition-all"
                  >
                    Fill Hunger
                  </button>
                  <button
                    onClick={debugUnlockAllCosmetics}
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-500 active:scale-95 transition-all"
                  >
                    Unlock All Cosmetics
                  </button>
                </div>
              </Section>

              <Section title="World / Level Jump">
                <div className="grid grid-cols-2 gap-1.5">
                  {WORLDS.map((world) => (
                    <button
                      key={world.id}
                      onClick={() => debugSetLevel(world.levelRange[0])}
                      className="px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 border"
                      style={{
                        backgroundColor: world.bgColor,
                        borderColor: world.gridColor,
                        color: '#334155',
                      }}
                    >
                      {world.name}
                      <span className="block text-[10px] opacity-60 font-normal mt-0.5">
                        Lvl {world.levelRange[0]}
                        {world.levelRange[1] !== Infinity ? `\u2013${world.levelRange[1]}` : '+'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 items-center pt-1">
                  <input
                    type="number"
                    min="1"
                    placeholder="Level #"
                    value={jumpLevel}
                    onChange={(e) => setJumpLevel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <button
                    onClick={handleJump}
                    className="px-4 py-1.5 bg-slate-700 text-white text-sm font-bold rounded-lg hover:bg-slate-600 active:scale-95 transition-all"
                  >
                    Go
                  </button>
                </div>
              </Section>

              <Section title="Performance Benchmark">
                <p className="text-xs text-slate-500">
                  Runs an automated stress test — renders hundreds of objects, particles, and effects
                  on screen simultaneously while measuring FPS over a fixed duration.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => { debugStartBenchmark(200, 10); onClose(); }}
                    className="py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.97] transition-all"
                  >
                    Light (200)
                  </button>
                  <button
                    onClick={() => { debugStartBenchmark(400, 10); onClose(); }}
                    className="py-2.5 rounded-xl font-bold text-sm bg-purple-600 text-white hover:bg-purple-500 active:scale-[0.97] transition-all"
                  >
                    Medium (400)
                  </button>
                  <button
                    onClick={() => { debugStartBenchmark(600, 10); onClose(); }}
                    className="py-2.5 rounded-xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-500 active:scale-[0.97] transition-all"
                  >
                    Heavy (600)
                  </button>
                  <button
                    onClick={() => { debugStartBenchmark(1000, 15); onClose(); }}
                    className="py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 active:scale-[0.97] transition-all"
                  >
                    Extreme (1000)
                  </button>
                </div>
                {benchmarkActive && (
                  <button
                    onClick={() => useGameStore.getState().debugStopBenchmark()}
                    className="w-full py-2 rounded-xl font-bold text-xs bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all mt-1"
                  >
                    Cancel Benchmark
                  </button>
                )}
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
