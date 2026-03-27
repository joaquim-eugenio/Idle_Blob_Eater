import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, ArrowCounterClockwise, Envelope, ArrowSquareOut } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const APP_VERSION = '0.0.0';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const sfxEnabled = useGameStore(s => s.sfxEnabled);
  const musicEnabled = useGameStore(s => s.musicEnabled);
  const hapticsEnabled = useGameStore(s => s.hapticsEnabled);
  const toggleSetting = useGameStore(s => s.toggleSetting);
  const resetGame = useGameStore(s => s.resetGame);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { onClose(); setConfirmReset(false); }}
          className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-3xl border-3 border-slate-400 shadow-lg shadow-slate-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
          >
            <div className="p-5 flex justify-between items-center bg-slate-700 text-white">
              <h2 className="text-xl font-black tracking-tight">Settings</h2>
              <button onClick={() => { onClose(); setConfirmReset(false); }} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Toggles */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Sound Effects</span>
                  <Toggle on={sfxEnabled} onToggle={() => toggleSetting('sfxEnabled')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Music</span>
                  <Toggle on={musicEnabled} onToggle={() => toggleSetting('musicEnabled')} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Haptics</span>
                  <Toggle on={hapticsEnabled} onToggle={() => toggleSetting('hapticsEnabled')} />
                </div>
              </div>

              <div className="mx-4 border-t border-slate-200" />

              {/* Info & Links */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-body">Version</span>
                  <span className="text-sm font-bold text-slate-600">{APP_VERSION}</span>
                </div>

                <a
                  href="mailto:support+IdleBlobEater@infinitygames.io"
                  className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Envelope size={16} className="text-slate-400" />
                  Contact Support
                </a>

                <a
                  href="https://infinitygames.io/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <ArrowSquareOut size={16} className="text-slate-400" />
                  Privacy Policy
                </a>
              </div>

              <div className="mx-4 border-t border-slate-200" />

              {/* Reset */}
              <div className="p-4">
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="btn-game w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 border-b-4 border-red-200 hover:bg-red-100 transition-all"
                  >
                    <ArrowCounterClockwise size={15} />
                    Reset All Progress
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-center text-red-600 font-bold">This will erase ALL progress permanently. Are you sure?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="btn-game flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 border-b-4 border-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { resetGame(); setConfirmReset(false); onClose(); }}
                        className="btn-game flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 border-b-4 border-red-700 transition-all"
                      >
                        Yes, Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
