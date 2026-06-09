import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useGameStore } from './store/gameStore';

// Dev-only: expose the store on window for manual debugging from devtools.
// Vite injects import.meta.env at build time; the cast keeps tsc happy
// without pulling vite's full client types.
const meta = import.meta as unknown as { env?: { DEV?: boolean } };
if (meta.env?.DEV) {
  (window as unknown as { __store: typeof useGameStore }).__store = useGameStore;
}

// ─── Crash logger ─────────────────────────────────────────────────────────────
// Mobile WebViews sometimes terminate the app on certain unhandled errors,
// which makes diagnosis hard. We persist any uncaught errors to localStorage
// and surface them on next launch so users can share a stack trace with us.
const CRASH_KEY = '__blob_last_crash';
type CrashLog = { kind: 'error' | 'rejection'; message: string; stack: string; ts: number; ua: string };

function recordCrash(kind: CrashLog['kind'], message: string, stack: string) {
  try {
    const log: CrashLog = {
      kind, message, stack,
      ts: Date.now(),
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };
    localStorage.setItem(CRASH_KEY, JSON.stringify(log));
  } catch { /* ignore */ }
}
window.addEventListener('error', (e) => {
  recordCrash('error', String(e.message || e.error?.message || 'unknown'),
    String(e.error?.stack || `${e.filename}:${e.lineno}:${e.colno}`));
});
window.addEventListener('unhandledrejection', (e) => {
  const r = e.reason;
  recordCrash('rejection',
    String(r?.message || r || 'unknown'),
    String(r?.stack || ''));
});

function showLastCrashBanner() {
  try {
    const raw = localStorage.getItem(CRASH_KEY);
    if (!raw) return;
    const log: CrashLog = JSON.parse(raw);
    const banner = document.createElement('div');
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'z-index:99999', 'background:#7f1d1d', 'color:#fee2e2',
      'font:12px/1.3 ui-monospace,monospace', 'padding:8px 12px',
      'border-bottom:2px solid #fecaca', 'max-height:45vh', 'overflow:auto',
      'white-space:pre-wrap',
    ].join(';');
    banner.textContent =
      `[Last crash @ ${new Date(log.ts).toLocaleString()}] ${log.kind}: ${log.message}\n${log.stack}\n\nTap to dismiss`;
    banner.addEventListener('click', () => {
      localStorage.removeItem(CRASH_KEY);
      banner.remove();
    });
    document.body.appendChild(banner);
  } catch { /* ignore */ }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Show prior crash banner after first paint so React doesn't blow it away.
requestAnimationFrame(() => requestAnimationFrame(showLastCrashBanner));
