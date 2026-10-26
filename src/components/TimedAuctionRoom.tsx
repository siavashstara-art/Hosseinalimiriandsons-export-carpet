import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface TimedAuctionRoomProps {
  currentLang: AppLang;
}

interface AuctionItem {
  id: string;
  title: string;
  titleEn?: string;
  artist: string;
  raj: number;
  origin: string;
  startingPriceToman: number;
  currentBidToman: number;
  highestBidder: string;
  totalBids: number;
  endTimeSeconds: number;
  image: string;
}

export const TimedAuctionRoom: React.FC<TimedAuctionRoomProps> = ({ currentLang }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([
    {
      id: 'auc-1',
      title: 'قالیچه ابریشم قم طرح شکارگاه سلطنتی',
      titleEn: 'Royal Qom Silk Hunting Masterpiece',
      artist: 'استاد استادان قم',
      raj: 70,
      origin: 'قم (Qom)',
      startingPriceToman: 450,
      currentBidToman: 520,
      highestBidder: 'سهراب م. (تهران)',
      totalBids: 14,
      endTimeSeconds: 3640, // 1 hour approx
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'auc-2',
      title: 'قالی ۶ متری تبریز چله ابریشم طرح ماهی درهم',
      titleEn: 'Tabriz 6sqm Silk Warp Fish Design',
      artist: 'کارگاه استاد تبریزی',
      raj: 60,
      origin: 'تبریز (Tabriz)',
      startingPriceToman: 280,
      currentBidToman: 310,
      highestBidder: 'دکتر علوی (اصفهان)',
      totalBids: 8,
      endTimeSeconds: 7200,
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  const [selectedAuctionId, setSelectedAuctionId] = useState<string>('auc-1');
  const [bidAmount, setBidAmount] = useState<number>(550);
  const [bidderName, setBidderName] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev => prev.map(item => ({
        ...item,
        endTimeSeconds: item.endTimeSeconds > 0 ? item.endTimeSeconds - 1 : 0
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAuction = auctions.find(a => a.id === selectedAuctionId) || auctions[0];

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidMessage(null);

    if (!bidderName.trim()) {
      setBidMessage({ type: 'error', text: 'لطفاً نام و نام خانوادگی خود را برای ثبت در مزایده وارد کنید.' });
      return;
    }

    if (bidAmount <= activeAuction.currentBidToman) {
      setBidMessage({ type: 'error', text: `مبلغ پیشنهادی باید بیشتر از بالاترین قیمت فعلی (${activeAuction.currentBidToman} میلیون تومان) باشد.` });
      return;
    }

    setAuctions(prev => prev.map(item => {
      if (item.id === activeAuction.id) {
        return {
          ...item,
          currentBidToman: bidAmount,
          highestBidder: `${bidderName} (تایید شده)`,
          totalBids: item.totalBids + 1
        };
      }
      return item;
    }));

    setBidMessage({ type: 'success', text: `پیشنهاد مبلغ ${bidAmount} میلیون تومان با موفقیت در اتاق مزایده زمان‌دار ثبت شد!` });
    setBidAmount(bidAmount + 20);
  };

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden border border-amber-500/30">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
        <div>
          <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-gavel text-amber-400 animate-bounce"></i>
            <span>اتاق مزایده زمان‌دار و حراج آنلاین قالی‌های فاخر</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Timed Bidding & Live Auction Room — رقابت زنده برای تملک شاهکارهای دستباف موزه ای
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-xl text-xs font-black animate-pulse">
            <i className="fa-solid fa-clock me-1.5"></i>
            مزایده زنده در جریان
          </span>
        </div>
      </div>

      {/* Auction Selection Tabs */}
      <div className="grid md:grid-cols-2 gap-4">
        {auctions.map((auc) => {
          const isSelected = auc.id === selectedAuctionId;
          return (
            <div
              key={auc.id}
              onClick={() => setSelectedAuctionId(auc.id)}
              className={`glass-card rounded-2xl p-4 cursor-pointer transition flex items-center gap-4 ${
                isSelected
                  ? 'border-2 border-amber-500 bg-amber-500/10 shadow-xl'
                  : 'hover:border-amber-500/40 bg-slate-900/60'
              }`}
            >
              <img src={auc.image} alt={auc.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800" />
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-amber-200 text-xs line-clamp-1">{auc.title}</h4>
                <div className="text-[11px] text-slate-300">
                  بالاترین پیشنهاد: <strong className="text-emerald-400 font-mono">{auc.currentBidToman} میلیون ت</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>زمان باقی‌مانده:</span>
                  <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {formatTime(auc.endTimeSeconds)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Auction Detail & Bidding Box */}
      <div className="glass-card rounded-2xl p-6 bg-slate-900/90 border border-amber-500/30 grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-950 border border-slate-800">
            <img src={activeAuction.image} alt={activeAuction.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow">
              {activeAuction.origin} | {activeAuction.raj} رج
            </div>
          </div>
          <div>
            <h3 className="font-bold text-amber-200 text-sm">{activeAuction.title}</h3>
            <p className="text-xs text-slate-400 mt-1">اثر ثبت‌شده در اتاق مزایده با ضمانت اصالت رسمی و تاییدیه صنف.</p>
          </div>
        </div>

        <div className="space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">قیمت پایه:</span>
            <span className="text-xs font-bold text-slate-200 font-mono">{activeAuction.startingPriceToman} میلیون تومان</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">بالاترین پیشنهاد فعلی:</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{activeAuction.currentBidToman} میلیون تومان</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">برنده موقت مزایده:</span>
            <span className="text-xs font-bold text-amber-300">{activeAuction.highestBidder}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">زمان باقیمانده حراج:</span>
            <span className="text-base font-black font-mono text-amber-400 animate-pulse">
              {formatTime(activeAuction.endTimeSeconds)}
            </span>
          </div>

          {/* Bidding Form */}
          <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">نام و نام خانوادگی خریدار / bidder</label>
              <input
                type="text"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                placeholder="مثال: علی‌رضا مهدوی"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-bold mb-1">مبلغ پیشنهاد (میلیون تومان)</label>
              <input
                type="number"
                min={activeAuction.currentBidToman + 5}
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {bidMessage && (
              <div className={`p-2.5 rounded-xl text-xs font-bold ${
                bidMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {bidMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full gold-grad text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-gavel"></i>
              <span>ثبت پیشنهاد در مزایده زمان‌دار</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
