import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePanelPause } from '../hooks/usePanelPause';
import {
  FEATURED_PACKS, MILESTONE_PACKS, GEM_PACKS,
  PERMANENT_BOOSTS, IAP_BOOSTS, CONSUMABLES,
  GEM_BUNDLES, IAP_BUNDLES,
  FREE_GIFT_COOLDOWN_MS, FREE_GIFT_MAX_DAILY,
  getDailyDealForDate,
} from '../lib/storeItems';
import { DAILY_REWARDS, STREAK_MULTIPLIERS } from '../lib/constants';
import {
  GemIcon, CloseIcon, GiftIcon, FireIcon, StarIcon,
  BoltIcon, ClockIcon, CoinIcon, MagnetIcon, CoinsStackIcon,
  CheckIcon,
} from './icons';
import { motion, AnimatePresence } from 'motion/react';
import { LunchboxReveal } from './LunchboxReveal';

type StoreTab = 'featured' | 'daily' | 'gems' | 'boosts' | 'bundles';

const TAB_CONFIG: { id: StoreTab; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'daily',    label: 'Daily' },
  { id: 'gems',     label: 'Gems' },
  { id: 'boosts',   label: 'Boosts' },
  { id: 'bundles',  label: 'Bundles' },
];

function BadgeRibbon({ text, color = 'bg-red-500' }: { text: string; color?: string }) {
  return (
    <div className={`absolute -top-1 -right-1 ${color} text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-xl z-10 shadow-sm`}>
      {text}
    </div>
  );
}

function StrikethroughPrice({ original, deal }: { original: number; deal: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="line-through text-slate-400 text-xs">{original}</span>
      <span className="text-emerald-600 font-black">{deal}</span>
    </span>
  );
}

function FreeGiftTimer({ lastClaim, claimsToday, lastDate }: { lastClaim: number; claimsToday: number; lastDate: string }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const isNewDay = lastDate !== today;
  const effectiveClaims = isNewDay ? 0 : claimsToday;
  const remaining = FREE_GIFT_MAX_DAILY - effectiveClaims;
  const timeSinceClaim = now - lastClaim;
  const canClaim = (isNewDay || timeSinceClaim >= FREE_GIFT_COOLDOWN_MS) && remaining > 0;
  const cooldownLeft = Math.max(0, FREE_GIFT_COOLDOWN_MS - timeSinceClaim);

  const hours = Math.floor(cooldownLeft / 3600000);
  const mins = Math.floor((cooldownLeft % 3600000) / 60000);
  const secs = Math.floor((cooldownLeft % 60000) / 1000);

  return { canClaim, remaining, timeLabel: `${hours}h ${mins}m ${secs}s`, cooldownLeft };
}

function FeaturedTab() {
  const { purchasedPacks, highestLevelReached, stats, buyIAPProduct } = useGameStore();

  return (
    <div className="space-y-3">
      {FEATURED_PACKS.map(pack => {
        const owned = purchasedPacks.includes(pack.id);
        return (
          <div key={pack.id} className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300 shadow-md shadow-amber-100/40">
            {pack.badge && <BadgeRibbon text={pack.badge} color="bg-amber-500" />}
            <div className="font-black text-lg text-amber-800">{pack.name}</div>
            <div className="text-xs text-amber-700/80 font-body mt-0.5 mb-2">{pack.desc}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {pack.contents.map((c, i) => (
                <span key={i} className="bg-white/70 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">{c}</span>
              ))}
            </div>
            <button
              onClick={() => buyIAPProduct(pack.id)}
              disabled={owned}
              className={`btn-game w-full py-2.5 rounded-xl font-bold text-sm border-b-4 transition-all ${
                owned
                  ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
                  : 'bg-amber-500 text-white border-amber-700 hover:bg-amber-400'
              }`}
            >
              {owned ? 'Owned' : pack.price}
            </button>
          </div>
        );
      })}

      <DailyDealSection />

      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-1">Milestone Packs</div>
      {MILESTONE_PACKS.map(pack => {
        const owned = purchasedPacks.includes(pack.id);
        let unlocked = true;
        if (pack.unlockCondition) {
          if (pack.unlockCondition.type === 'level') unlocked = highestLevelReached >= pack.unlockCondition.value;
          if (pack.unlockCondition.type === 'prestige') unlocked = stats.totalPrestiges >= pack.unlockCondition.value;
        }
        if (!unlocked) return null;
        return (
          <div key={pack.id} className="relative bg-white rounded-xl p-3 border-2 border-slate-200 flex items-center justify-between gap-3">
            {!owned && <BadgeRibbon text="NEW!" color="bg-blue-500" />}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-800">{pack.name}</div>
              <div className="text-[10px] text-slate-500 font-body">{pack.desc}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {pack.contents.map((c, i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">{c}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => buyIAPProduct(pack.id)}
              disabled={owned}
              className={`btn-game px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap border-b-4 transition-all ${
                owned
                  ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
                  : 'bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-400'
              }`}
            >
              {owned ? 'Owned' : pack.price}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DailyDealSection() {
  const { gems, dailyDealPurchased, dailyDealDate, buyDailyDeal } = useGameStore();
  const today = new Date().toISOString().split('T')[0];
  const deal = getDailyDealForDate(today);
  const alreadyBought = dailyDealPurchased && dailyDealDate === today;
  const canAfford = gems >= deal.dealCost;

  const [secsLeft, setSecsLeft] = useState(0);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      setSecsLeft(Math.floor((midnight.getTime() - now.getTime()) / 1000));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const hrs = Math.floor(secsLeft / 3600);
  const mins = Math.floor((secsLeft % 3600) / 60);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border-2 border-emerald-200">
      <div className="flex items-center justify-between mb-1">
        <div className="font-black text-sm text-emerald-800">Today's Special</div>
        <div className="text-[10px] text-emerald-600 font-bold">{hrs}h {mins}m left</div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-sm text-slate-800">{deal.name}</div>
          <div className="text-xs text-slate-500 font-body">{deal.desc}</div>
          <div className="mt-1">
            <StrikethroughPrice original={deal.originalCost} deal={deal.dealCost} />
          </div>
        </div>
        <button
          onClick={buyDailyDeal}
          disabled={alreadyBought || !canAfford}
          className={`btn-game px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap border-b-4 transition-all flex items-center gap-1.5 ${
            alreadyBought
              ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
              : canAfford
                ? 'bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          {alreadyBought ? 'Claimed' : <><GemIcon size={13} />{deal.dealCost}</>}
        </button>
      </div>
    </div>
  );
}

function DailyTab() {
  const {
    freeGiftLastClaim, freeGiftClaimsToday, lastFreeGiftDate,
    claimFreeGift, dailyReward, claimDailyReward,
  } = useGameStore();

  const [revealReward, setRevealReward] = useState<string | null>(null);
  const timerState = FreeGiftTimer({ lastClaim: freeGiftLastClaim, claimsToday: freeGiftClaimsToday, lastDate: lastFreeGiftDate });

  const handleClaim = () => {
    const reward = claimFreeGift();
    if (reward) {
      setRevealReward(reward.label);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const canClaimDaily = dailyReward.lastClaimDate !== today;
  const currentDay = dailyReward.cycleDay;
  const streak = dailyReward.streak;
  const streakMult = STREAK_MULTIPLIERS[Math.min(streak, STREAK_MULTIPLIERS.length - 1)];

  return (
    <div className="space-y-4">
      {/* Lunchbox opening animation */}
      <AnimatePresence>
        {revealReward && (
          <LunchboxReveal
            reward={revealReward}
            onClose={() => setRevealReward(null)}
          />
        )}
      </AnimatePresence>

      {/* Free Lunchbox */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <GiftIcon size={22} className="text-blue-500" />
          <div className="font-black text-base text-blue-800">Free Lunchbox</div>
        </div>
        <div className="text-xs text-blue-700/80 font-body mb-3">
          {timerState.remaining} of {FREE_GIFT_MAX_DAILY} gifts left today
        </div>

        <button
          onClick={handleClaim}
          disabled={!timerState.canClaim}
          className={`btn-game w-full py-2.5 rounded-xl font-bold text-sm border-b-4 transition-all ${
            timerState.canClaim
              ? 'bg-blue-500 text-white border-blue-700 hover:bg-blue-400'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          {timerState.canClaim ? 'Open Lunchbox!' : timerState.timeLabel}
        </button>
      </div>

      {/* 7-Day Streak */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300">
        <div className="flex items-center justify-between mb-2">
          <div className="font-black text-base text-amber-800">Daily Streak</div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
              <FireIcon size={14} />
              {streak} day streak! ({streakMult}x)
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {DAILY_REWARDS.map((reward, i) => {
            const isToday = i === currentDay;
            const isPast = i < currentDay;
            return (
              <div
                key={i}
                className={`rounded-lg p-1.5 text-center border-2 transition-all ${
                  isToday
                    ? 'border-amber-500 bg-amber-100 scale-105 shadow-md shadow-amber-200/40'
                    : isPast
                      ? 'border-slate-200 bg-slate-100 opacity-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-[8px] font-bold text-slate-400">D{reward.day}</div>
                <div className={`text-[9px] font-bold ${isToday ? 'text-amber-600' : 'text-slate-600'}`}>
                  {reward.label}
                </div>
                {isPast && <CheckIcon size={10} className="mx-auto text-green-500 mt-0.5" />}
              </div>
            );
          })}
        </div>

        {canClaimDaily && (
          <button
            onClick={() => claimDailyReward()}
            className="btn-game w-full py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm border-b-4 border-amber-700 hover:bg-amber-400 transition-all"
          >
            Claim Day {currentDay + 1}!
          </button>
        )}
        {!canClaimDaily && (
          <div className="text-center text-xs text-amber-600 font-bold py-2">
            Come back tomorrow!
          </div>
        )}
      </div>
    </div>
  );
}

function GemsTab() {
  const { buyIAPProduct } = useGameStore();

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 font-body mb-1">Bigger packs = more bonus gems!</div>
      {GEM_PACKS.map((pack, idx) => (
        <div key={pack.id} className="relative bg-white rounded-xl p-3 border-2 border-purple-200 flex items-center justify-between gap-3">
          {pack.badge && <BadgeRibbon text={pack.badge} color={idx === 2 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'} />}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-1">
              <GemIcon size={18} className="text-purple-500" />
              <span className="font-black text-lg text-purple-700">{pack.gems}</span>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">{pack.name}</div>
              {pack.bonus > 0 && (
                <div className="text-[10px] text-emerald-600 font-bold">+{pack.bonus} bonus!</div>
              )}
            </div>
          </div>
          <button
            onClick={() => buyIAPProduct(pack.id)}
            className="btn-game px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap bg-purple-500 text-white border-b-4 border-purple-700 hover:bg-purple-400 transition-all"
          >
            {pack.price}
          </button>
        </div>
      ))}
    </div>
  );
}

function BoostsTab() {
  const { gems, purchasedPermanentBoosts, buyPermanentBoost, buyConsumable, buyIAPProduct, consumableInventory, useConsumable } = useGameStore();

  const iconMap: Record<string, typeof BoltIcon> = {
    coin: CoinIcon, clock: ClockIcon, magnet: MagnetIcon, bolt: BoltIcon, fire: FireIcon, star: StarIcon,
  };

  return (
    <div className="space-y-4">
      {/* Permanent Boosts - Gems */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Permanent Boosts</div>
        <div className="space-y-2">
          {PERMANENT_BOOSTS.map(boost => {
            const owned = purchasedPermanentBoosts.includes(boost.id);
            const canAfford = gems >= boost.cost;
            const Icon = iconMap[boost.icon] || BoltIcon;
            return (
              <div key={boost.id} className="bg-white rounded-xl p-3 border-2 border-purple-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800">{boost.name}</div>
                  <div className="text-[10px] text-slate-500 font-body">{boost.desc}</div>
                </div>
                <button
                  onClick={() => buyPermanentBoost(boost.id)}
                  disabled={owned || !canAfford}
                  className={`btn-game px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap border-b-4 transition-all flex items-center gap-1.5 ${
                    owned
                      ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
                      : canAfford
                        ? 'bg-purple-500 text-white border-purple-700 hover:bg-purple-600'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {owned ? 'Owned' : <><GemIcon size={13} />{boost.cost}</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consumables */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consumables</div>
        <div className="space-y-2">
          {CONSUMABLES.map(item => {
            const canAfford = gems >= item.cost;
            const owned = consumableInventory[item.id] || 0;
            const Icon = iconMap[item.icon] || BoltIcon;
            return (
              <div key={item.id} className="bg-white rounded-xl p-3 border-2 border-blue-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-body">{item.desc}</div>
                  {owned > 0 && (
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Owned: {owned}</div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => buyConsumable(item.id)}
                    disabled={!canAfford}
                    className={`btn-game px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap border-b-3 transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-blue-500 text-white border-blue-700 hover:bg-blue-600'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <GemIcon size={11} />{item.cost}
                  </button>
                  {owned > 0 && (
                    <button
                      onClick={() => useConsumable(item.id)}
                      className="btn-game px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-500 text-white border-b-3 border-emerald-700 hover:bg-emerald-400 transition-all"
                    >
                      Use
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Money Permanent Boosts */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Premium Boosts</div>
        <div className="space-y-2">
          {IAP_BOOSTS.map(boost => {
            const owned = purchasedPermanentBoosts.includes(boost.id);
            const Icon = iconMap[boost.icon] || BoltIcon;
            return (
              <div key={boost.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border-2 border-amber-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800">{boost.name}</div>
                  <div className="text-[10px] text-slate-500 font-body">{boost.desc}</div>
                </div>
                <button
                  onClick={() => buyIAPProduct(boost.id)}
                  disabled={owned}
                  className={`btn-game px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap border-b-4 transition-all ${
                    owned
                      ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
                      : 'bg-amber-500 text-white border-amber-700 hover:bg-amber-400'
                  }`}
                >
                  {owned ? 'Owned' : boost.priceLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BundlesTab() {
  const { gems, purchasedPacks, buyGemBundle, buyIAPProduct } = useGameStore();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gem Bundles</div>
        <div className="space-y-2">
          {GEM_BUNDLES.map(bundle => {
            const canAfford = gems >= bundle.cost;
            return (
              <div key={bundle.id} className="relative bg-white rounded-xl p-3 border-2 border-indigo-200">
                <div className="absolute top-1 right-1 bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full">
                  {bundle.savings}
                </div>
                <div className="font-bold text-sm text-slate-800">{bundle.name}</div>
                <div className="text-[10px] text-slate-500 font-body mb-2">{bundle.desc}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bundle.contents.map((c, i) => (
                    <span key={i} className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold border border-indigo-100">{c}</span>
                  ))}
                </div>
                <button
                  onClick={() => buyGemBundle(bundle.id)}
                  disabled={!canAfford}
                  className={`btn-game w-full py-2 rounded-lg font-bold text-sm border-b-4 transition-all flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-400'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <GemIcon size={13} />{bundle.cost}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Premium Bundles</div>
        <div className="space-y-2">
          {IAP_BUNDLES.map(bundle => {
            if (bundle.weekendOnly && !isWeekend) return null;
            const owned = bundle.oneTime && purchasedPacks.includes(bundle.id);
            return (
              <div key={bundle.id} className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border-2 border-amber-200">
                {bundle.badge && <BadgeRibbon text={bundle.badge} color="bg-amber-500" />}
                <div className="absolute top-1 right-12 bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full">
                  {bundle.savings}
                </div>
                <div className="font-bold text-sm text-slate-800">{bundle.name}</div>
                <div className="text-[10px] text-slate-500 font-body mb-2">{bundle.desc}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bundle.contents.map((c, i) => (
                    <span key={i} className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold border border-amber-200">{c}</span>
                  ))}
                </div>
                <button
                  onClick={() => buyIAPProduct(bundle.id)}
                  disabled={owned}
                  className={`btn-game w-full py-2 rounded-lg font-bold text-sm border-b-4 transition-all ${
                    owned
                      ? 'bg-green-100 text-green-600 border-green-200 cursor-default'
                      : 'bg-amber-500 text-white border-amber-700 hover:bg-amber-400'
                  }`}
                >
                  {owned ? 'Owned' : bundle.priceLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Store() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StoreTab>('featured');
  usePanelPause(isOpen);
  const gems = useGameStore(s => s.gems);

  const renderTab = () => {
    switch (activeTab) {
      case 'featured': return <FeaturedTab />;
      case 'daily':    return <DailyTab />;
      case 'gems':     return <GemsTab />;
      case 'boosts':   return <BoostsTab />;
      case 'bundles':  return <BundlesTab />;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-bar-icon relative p-2.5 bg-emerald-500 text-white rounded-full border-2 border-emerald-600 border-b-emerald-700 hover:bg-emerald-400 active:scale-95"
        >
          <CoinsStackIcon size={18} />
          <div className="absolute -top-1 -right-1 bg-emerald-300 text-emerald-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {gems}
          </div>
        </button>
        <span className="text-[10px] font-bold text-emerald-600">Store</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl border-3 border-emerald-400 shadow-lg shadow-emerald-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
            >
              {/* Header */}
              <div className="panel-header-game p-4 flex justify-between items-center bg-emerald-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Store</h2>
                  <div className="text-sm opacity-90 flex items-center gap-1.5 mt-0.5 font-body">
                    <GemIcon size={14} /><span>{gems} Gems</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b-2 border-slate-200 bg-slate-50">
                {TAB_CONFIG.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-1 py-2.5 text-[11px] font-bold text-center transition-all ${
                      activeTab === tab.id
                        ? 'text-emerald-600 border-b-3 border-emerald-500 bg-white'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4">
                {renderTab()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
