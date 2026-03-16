import { useState, ReactNode, useRef, useEffect } from 'react';
import { useGameStore, Upgrades } from '../store/gameStore';
import { UPGRADE_COSTS } from '../lib/constants';
import { Zap, Magnet, Utensils, PlusCircle, Clock, TrendingUp, X, Star, Activity, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SkillNode = ({ 
  x, y, 
  id, name, icon, desc,
  nodeLevel,
  currentLevel
}: { 
  x: number, y: number, 
  id: keyof Upgrades, name: string, icon: ReactNode, desc: string,
  nodeLevel: number,
  currentLevel: number
}) => {
  const money = useGameStore(state => state.money);
  const buyUpgrade = useGameStore(state => state.buyUpgrade);
  
  const isBought = nodeLevel < currentLevel;
  const isAvailable = nodeLevel === currentLevel;
  
  const cost = UPGRADE_COSTS[id](nodeLevel);
  const canAfford = money >= cost;

  let buttonClass = '';
  if (isBought) {
    buttonClass = 'bg-blue-500 border-blue-600 text-white shadow-inner';
  } else if (isAvailable) {
    if (canAfford) {
      buttonClass = 'bg-white border-blue-400 text-blue-500 hover:scale-110 hover:shadow-lg cursor-pointer';
    } else {
      buttonClass = 'bg-slate-50 border-slate-300 text-slate-400 cursor-not-allowed';
    }
  }

  return (
    <div 
      className="absolute flex flex-col items-center group z-20 hover:z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <button 
        onClick={() => isAvailable && buyUpgrade(id, cost)}
        disabled={!isAvailable || !canAfford}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all border-4 relative ${buttonClass}`}
      >
        {icon}
        <div className={`absolute -bottom-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border ${isBought ? 'bg-blue-700 border-blue-800 text-white' : 'bg-slate-800 border-slate-700 text-white'}`}>
          Lv.{nodeLevel + 1}
        </div>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-4 w-48 p-3 bg-slate-800 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
        <div className="font-bold text-sm mb-1">{name}</div>
        <div className="text-xs text-slate-300 mb-2">{desc}</div>
        {!isBought && (
          <div className={`text-xs font-bold ${canAfford ? 'text-green-400' : 'text-rose-400'}`}>
            Cost: ${cost}
          </div>
        )}
        {isBought && (
          <div className="text-xs font-bold text-blue-300">Purchased</div>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

const CategoryNode = ({ x, y, icon, name, colorClass }: { x: number, y: number, icon: ReactNode, name: string, colorClass: string }) => (
  <div 
    className="absolute flex flex-col items-center justify-center z-10"
    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md border-4 border-white bg-slate-100 ${colorClass}`}>
      {icon}
    </div>
    <div className="absolute top-full mt-2 font-bold text-slate-700 text-sm bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
      {name}
    </div>
  </div>
);

const RootNode = ({ x, y }: { x: number, y: number }) => (
  <div 
    className="absolute flex flex-col items-center justify-center z-10"
    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
  >
    <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-800 bg-white text-slate-800 animate-pulse">
      <CircleDot size={40} />
    </div>
    <div className="absolute top-full mt-3 font-black text-slate-800 text-base bg-white/90 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
      Blob Core
    </div>
  </div>
);

export function SkillTree() {
  const [isOpen, setIsOpen] = useState(false);
  const resetGame = useGameStore(state => state.resetGame);
  const upgrades = useGameStore(state => state.upgrades);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const container = scrollRef.current;
      container.scrollLeft = 1000 - container.clientWidth / 2;
      container.scrollTop = 1000 - container.clientHeight / 2;
    }
  }, [isOpen]);

  const renderCategoryTree = (
    catId: string, catName: string, catIcon: ReactNode,
    branchAId: keyof Upgrades, branchAName: string, branchAIcon: ReactNode,
    branchBId: keyof Upgrades, branchBName: string, branchBIcon: ReactNode,
    synergyId: keyof Upgrades, synergyName: string, synergyIcon: ReactNode,
    startX: number, startY: number,
    dirX: number, dirY: number,
    perpX: number, perpY: number
  ) => {
    const nodes = [];
    const lines = [];
    
    const levelA = upgrades[branchAId] || 0;
    const levelB = upgrades[branchBId] || 0;
    const levelSyn = upgrades[synergyId] || 0;

    const BLOCK_SIZE = 6;
    const NODE_SPACING = 80;
    const BRANCH_SPREAD = 100;

    const getCoords = (depth: number, branchOffset: number) => {
      return {
        x: startX + dirX * depth * NODE_SPACING + perpX * branchOffset * BRANCH_SPREAD,
        y: startY + dirY * depth * NODE_SPACING + perpY * branchOffset * BRANCH_SPREAD
      };
    };

    const catCoords = getCoords(0, 0);

    // Path A
    let prevACoords = catCoords;
    for (let i = 0; i <= levelA; i++) {
      const block = Math.floor(i / BLOCK_SIZE);
      if (block > levelSyn) break;

      const depth = block * (BLOCK_SIZE + 1) + (i % BLOCK_SIZE) + 1;
      const coords = getCoords(depth, 1);
      
      if (i % BLOCK_SIZE === 0) {
        const prevSynDepth = block * (BLOCK_SIZE + 1);
        prevACoords = getCoords(prevSynDepth, 0);
      }

      const isBought = i < levelA;
      lines.push(
        <line 
          key={`line-A-${branchAId}-${i}`}
          x1={prevACoords.x} y1={prevACoords.y} 
          x2={coords.x} y2={coords.y} 
          stroke={isBought ? '#3b82f6' : '#cbd5e1'} 
          strokeWidth="6" strokeLinecap="round"
          className="transition-colors duration-500"
        />
      );
      
      nodes.push(
        <SkillNode 
          key={`node-A-${branchAId}-${i}`}
          x={coords.x} y={coords.y} 
          id={branchAId} name={`${branchAName}`} icon={branchAIcon} desc=""
          nodeLevel={i} currentLevel={levelA}
        />
      );
      
      prevACoords = coords;
    }

    // Path B
    let prevBCoords = catCoords;
    for (let i = 0; i <= levelB; i++) {
      const block = Math.floor(i / BLOCK_SIZE);
      if (block > levelSyn) break;

      const depth = block * (BLOCK_SIZE + 1) + (i % BLOCK_SIZE) + 1;
      const coords = getCoords(depth, -1);
      
      if (i % BLOCK_SIZE === 0) {
        const prevSynDepth = block * (BLOCK_SIZE + 1);
        prevBCoords = getCoords(prevSynDepth, 0);
      }

      const isBought = i < levelB;
      lines.push(
        <line 
          key={`line-B-${branchBId}-${i}`}
          x1={prevBCoords.x} y1={prevBCoords.y} 
          x2={coords.x} y2={coords.y} 
          stroke={isBought ? '#3b82f6' : '#cbd5e1'} 
          strokeWidth="6" strokeLinecap="round"
          className="transition-colors duration-500"
        />
      );
      
      nodes.push(
        <SkillNode 
          key={`node-B-${branchBId}-${i}`}
          x={coords.x} y={coords.y} 
          id={branchBId} name={`${branchBName}`} icon={branchBIcon} desc=""
          nodeLevel={i} currentLevel={levelB}
        />
      );
      
      prevBCoords = coords;
    }

    // Synergy Nodes
    for (let i = 0; i <= levelSyn; i++) {
      const reqLevel = (i + 1) * BLOCK_SIZE;
      if (levelA >= reqLevel && levelB >= reqLevel) {
        const depth = (i + 1) * (BLOCK_SIZE + 1);
        const coords = getCoords(depth, 0);
        
        const lastADepth = depth - 1;
        const lastACoords = getCoords(lastADepth, 1);
        const lastBCoords = getCoords(lastADepth, -1);

        const isBought = i < levelSyn;

        lines.push(
          <line 
            key={`line-SynA-${synergyId}-${i}`}
            x1={lastACoords.x} y1={lastACoords.y} 
            x2={coords.x} y2={coords.y} 
            stroke={isBought ? '#3b82f6' : '#cbd5e1'} 
            strokeWidth="6" strokeLinecap="round"
          />
        );

        lines.push(
          <line 
            key={`line-SynB-${synergyId}-${i}`}
            x1={lastBCoords.x} y1={lastBCoords.y} 
            x2={coords.x} y2={coords.y} 
            stroke={isBought ? '#3b82f6' : '#cbd5e1'} 
            strokeWidth="6" strokeLinecap="round"
          />
        );

        nodes.push(
          <SkillNode 
            key={`node-Syn-${synergyId}-${i}`}
            x={coords.x} y={coords.y} 
            id={synergyId} name={`${synergyName}`} icon={synergyIcon} desc="Unlocks next tier & boosts stats"
            nodeLevel={i} currentLevel={levelSyn}
          />
        );
      }
    }

    return { nodes, lines };
  };

  const isSpeedActive = (upgrades.speed || 0) > 0 || (upgrades.boostSpawnRate || 0) > 0;
  const isSuctionActive = (upgrades.suction || 0) > 0 || (upgrades.suctionStrength || 0) > 0;
  const isHungerActive = (upgrades.hungerDrain || 0) > 0 || (upgrades.hungerMax || 0) > 0;
  const isSpawnActive = (upgrades.spawnRate || 0) > 0 || (upgrades.spawnValue || 0) > 0;

  const branches = [
    renderCategoryTree('speed', 'Speed', <Zap size={24} />, 'speed', 'Base Speed', <Zap size={20} />, 'boostSpawnRate', 'Star Spawn', <Star size={20} />, 'speedSynergy', 'Speed Synergy', <Zap size={24} />, 1000, 800, 0, -1, 1, 0),
    renderCategoryTree('suction', 'Suction', <Magnet size={24} />, 'suction', 'Radius', <Magnet size={20} />, 'suctionStrength', 'Strength', <Activity size={20} />, 'suctionSynergy', 'Suction Synergy', <Magnet size={24} />, 1200, 1000, 1, 0, 0, 1),
    renderCategoryTree('hunger', 'Hunger', <Utensils size={24} />, 'hungerDrain', 'Metabolism', <Utensils size={20} />, 'hungerMax', 'Stomach', <PlusCircle size={20} />, 'hungerSynergy', 'Hunger Synergy', <Utensils size={24} />, 1000, 1200, 0, 1, -1, 0),
    renderCategoryTree('spawn', 'Spawn', <Clock size={24} />, 'spawnRate', 'Rate', <Clock size={20} />, 'spawnValue', 'Value', <TrendingUp size={20} />, 'spawnSynergy', 'Spawn Synergy', <Clock size={24} />, 800, 1000, -1, 0, 0, -1),
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-8 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all z-10"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="22" x2="12" y2="8" />
          <line x1="12" y1="14" x2="6" y2="8" />
          <line x1="12" y1="14" x2="18" y2="8" />
          <line x1="12" y1="8" x2="8" y2="3" />
          <line x1="12" y1="8" x2="16" y2="3" />
          <circle cx="6" cy="8" r="1.5" fill="currentColor" />
          <circle cx="18" cy="8" r="1.5" fill="currentColor" />
          <circle cx="8" cy="3" r="1.5" fill="currentColor" />
          <circle cx="16" cy="3" r="1.5" fill="currentColor" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-50 w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white z-30 shadow-sm relative">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Skill Tree</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      resetGame();
                      setIsOpen(false);
                    }} 
                    className="px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                  >
                    Reset Progress
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-50/50 relative" ref={scrollRef}>
                <div className="w-[2000px] h-[2000px] relative">
                  
                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {/* Root to Categories */}
                    <line x1="1000" y1="1000" x2="1000" y2="800" stroke={isSpeedActive ? "#3b82f6" : "#cbd5e1"} strokeWidth="6" strokeLinecap="round" />
                    <line x1="1000" y1="1000" x2="1200" y2="1000" stroke={isSuctionActive ? "#3b82f6" : "#cbd5e1"} strokeWidth="6" strokeLinecap="round" />
                    <line x1="1000" y1="1000" x2="1000" y2="1200" stroke={isHungerActive ? "#3b82f6" : "#cbd5e1"} strokeWidth="6" strokeLinecap="round" />
                    <line x1="1000" y1="1000" x2="800" y2="1000" stroke={isSpawnActive ? "#3b82f6" : "#cbd5e1"} strokeWidth="6" strokeLinecap="round" />

                    {branches.map(b => b.lines)}
                  </svg>

                  {/* Root */}
                  <RootNode x={1000} y={1000} />

                  {/* Categories */}
                  <CategoryNode x={1000} y={800} icon={<Zap size={24} />} name="Speed" colorClass="text-yellow-500" />
                  <CategoryNode x={1200} y={1000} icon={<Magnet size={24} />} name="Suction" colorClass="text-purple-500" />
                  <CategoryNode x={1000} y={1200} icon={<Utensils size={24} />} name="Hunger" colorClass="text-orange-500" />
                  <CategoryNode x={800} y={1000} icon={<Clock size={24} />} name="Spawn" colorClass="text-emerald-500" />

                  {/* Dynamic Nodes */}
                  {branches.map(b => b.nodes)}
                  
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
