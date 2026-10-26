import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  expiresAt: string;
}

const DEFAULT_BANNERS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'حجره ویژه صادرکنندگان ابریشم تبریز',
    subtitle: 'ارسال مستقیم به سراسر اروپا و خاورمیانه با ضمانت اصالت',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#booths',
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'ad-2',
    title: 'نمایشگاه بین‌المللی فرش دستباف تهران',
    subtitle: 'ثبت‌نام رایگان حجره‌داران صنف فرش در سراسر کشور',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#booths',
    isActive: true,
    expiresAt: '2026-12-31'
  }
];

interface AdSliderProps {
  currentLang: AppLang;
}

export const AdSlider: React.FC<AdSliderProps> = ({ currentLang }) => {
  const [banners, setBanners] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem('alimiri_admin_ads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_BANNERS;
      }
    }
    return DEFAULT_BANNERS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners.filter(b => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex % activeBanners.length];

  return (
    <div className="w-full my-4 overflow-hidden rounded-3xl glass-card border border-amber-500/30 shadow-2xl relative group">
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-widest shadow">
              {currentLang === 'en' ? 'Sponsored Booth' : 'آگهی ویژه صنف'}
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              {currentBanner.subtitle}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white drop-shadow">
            {currentBanner.title}
          </h3>
        </div>
      </div>

      {activeBanners.length > 1 && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === (currentIndex % activeBanners.length)
                  ? 'bg-amber-400 w-6'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
