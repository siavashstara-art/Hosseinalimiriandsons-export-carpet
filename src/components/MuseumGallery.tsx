import React, { useState } from 'react';
import { AppLang, MuseumRugItem } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';
import brandCrestImg from '../assets/images/alimiri_brand_crest_1792998593279.jpg';

interface MuseumGalleryProps {
  currentLang: AppLang;
}

export const MUSEUM_RUGS: MuseumRugItem[] = [
  {
    id: 'tabriz-60-silk',
    titleFa: 'قالیچه شاهکار تبریز ۶۰ رج چله ابریشم (طرح لچک ترنج)',
    titleEn: 'Imperial Tabriz 60 Raj Silk Warp Masterpiece',
    origin: 'تبریز (Tabriz Masterwork)',
    raj: 60,
    size: '۲۰۰ × ۳۰۰ سانتیمتر (۶ متر)',
    material: 'چله ابریشم + گل‌های ابریشم طبیعی',
    priceUSD: 8500,
    priceEUR: 7800,
    priceAED: 31200,
    priceJPY: 1280000,
    priceTomanMillion: 510,
    image: heroRugImg,
    description: 'اثری موزه ای با رنگرزی گیاهی سنتی، بافته‌شده به دست استادکاران برجسته تبریز با حاشیه اسلیمی طلاکوب.'
  },
  {
    id: 'qom-100-fullsilk',
    titleFa: 'قالیچه تمام ابریشم قم ۷۰ رج (طرح شکارگاه موزه‌ای)',
    titleEn: 'Qom Pure Silk 70 Raj Hunting Design Masterwork',
    origin: 'قم (Qom Pure Silk)',
    raj: 70,
    size: '۱۵۰ × ۲۰۰ سانتیمتر (۳ متر)',
    material: '۱۰۰٪ ابریشم خالص قم',
    priceUSD: 12500,
    priceEUR: 11500,
    priceAED: 45900,
    priceJPY: 1880000,
    priceTomanMillion: 750,
    image: heroRugImg,
    description: 'شاهکار تمام ابریشم با تراکم خیره‌کننده، بازآفرینی مینیاتورهای اصیل ایرانی و شکارگاه شاهنشاهی.'
  },
  {
    id: 'isfahan-master-80',
    titleFa: 'قالیچه اصفهان استادباف چله ابریشم (نقشه صیرفیان)',
    titleEn: 'Isfahan Master-woven Silk Warp (Seirafian Pattern)',
    origin: 'اصفهان (Isfahan Seirafian)',
    raj: 65,
    size: '۲۰۰ × ۳۰۰ سانتیمتر (۶ متر)',
    material: 'کرک و ابریشم اعلی با چله ابریشم',
    priceUSD: 15000,
    priceEUR: 13800,
    priceAED: 55000,
    priceJPY: 2250000,
    priceTomanMillion: 900,
    image: heroRugImg,
    description: 'دارای امضای استاد صیرفیان در حاشیه بالا، گره‌های فوق‌العاده ریز و تار و پود ابریشم طبیعی.'
  }
];

export const MuseumGallery: React.FC<MuseumGalleryProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'AED' | 'JPY' | 'TOMAN'>('USD');
  const [activeRug, setActiveRug] = useState<MuseumRugItem>(MUSEUM_RUGS[0]);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const getPriceDisplay = (rug: MuseumRugItem) => {
    switch (selectedCurrency) {
      case 'EUR': return `€${rug.priceEUR.toLocaleString()} EUR`;
      case 'AED': return `${rug.priceAED.toLocaleString()} AED (د.إ)`;
      case 'JPY': return `¥${rug.priceJPY.toLocaleString()} JPY`;
      case 'TOMAN': return `${rug.priceTomanMillion.toLocaleString()} میلیون تومان`;
      default: return `$${rug.priceUSD.toLocaleString()} USD`;
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Title & Currency Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-landmark text-amber-400"></i>
            <span>تالار بین‌المللی موزه‌ها و حراجی‌های جهان</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            International Fine Rug Auction & Heritage Exhibition — Hossein Alimiri & Sons
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 font-bold">ارز:</span>
          {(['USD', 'EUR', 'AED', 'JPY', 'TOMAN'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                selectedCurrency === curr
                  ? 'gold-grad text-slate-950 shadow'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Rug Cards Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {MUSEUM_RUGS.map((rug) => {
          const isSelected = activeRug.id === rug.id;

          return (
            <div
              key={rug.id}
              onClick={() => setActiveRug(rug)}
              className={`glass-card rounded-2xl p-4 space-y-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-amber-500 shadow-xl shadow-amber-500/20 scale-[1.02] bg-amber-500/10'
                  : 'hover:border-amber-500/40 bg-slate-900/60'
              }`}
            >
              <div className="relative rounded-xl overflow-hidden h-44 bg-slate-950 border border-slate-800">
                <img
                  src={rug.image}
                  alt={rug.titleFa}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 bg-amber-500/90 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] shadow">
                  {rug.origin}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-amber-200 text-xs line-clamp-1">
                  {currentLang === 'en' ? rug.titleEn : rug.titleFa}
                </h3>
                <div className="text-[11px] text-slate-400">
                  ابعاد: <strong className="text-slate-200 me-2">{rug.size}</strong> | رجشمار: <strong className="text-amber-300 me-2">{rug.raj} رج</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="font-black text-emerald-400 font-mono">
                  {getPriceDisplay(rug)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRug(rug);
                    setShowCertificateModal(true);
                  }}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-[11px] font-bold border border-amber-500/40 transition"
                >
                  شناسنامه رسمی
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Rug Spotlight */}
      <div className="glass-card-amber p-6 rounded-2xl border border-amber-500/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between border-b border-amber-500/20 pb-3 gap-2">
          <div className="font-black text-amber-300 text-sm md:text-base flex items-center gap-2">
            <i className="fa-solid fa-gem text-amber-400"></i>
            <span>{currentLang === 'en' ? activeRug.titleEn : activeRug.titleFa}</span>
          </div>

          <span className="text-emerald-400 font-mono font-black text-base">
            {getPriceDisplay(activeRug)}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          {activeRug.description}
        </p>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="gold-grad text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <i className="fa-solid fa-file-contract"></i>
            <span>مشاهده و صدور شناسنامه موزه بین‌المللی</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-xl w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
              <img src={brandCrestImg} alt="Crest" className="w-12 h-12 rounded-full border border-amber-500/50" />
              <div>
                <h3 className="font-black text-amber-300 text-sm">شناسنامه بین‌المللی و موزه فرش دستباف</h3>
                <span className="text-[10px] text-slate-400">Hossein Alimiri & Sons International Fine Rug Certificate</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div><span className="text-slate-400">نام اثر:</span> <strong className="text-amber-200 block text-xs">{activeRug.titleFa}</strong></div>
              <div><span className="text-slate-400">مکتب بافت:</span> <strong className="text-amber-200 block text-xs">{activeRug.origin}</strong></div>
              <div><span className="text-slate-400">رجشمار:</span> <strong className="text-amber-200 block text-xs">{activeRug.raj} رج</strong></div>
              <div><span className="text-slate-400">مواد اولیه:</span> <strong className="text-amber-200 block text-xs">{activeRug.material}</strong></div>
              <div><span className="text-slate-400">ابعاد رسمی:</span> <strong className="text-amber-200 block text-xs">{activeRug.size}</strong></div>
              <div><span className="text-slate-400">ارزشیابی بین‌المللی:</span> <strong className="text-emerald-400 block font-mono text-xs">{getPriceDisplay(activeRug)}</strong></div>
            </div>

            <div className="text-xs text-slate-300 italic border-l-2 border-amber-500 ps-3">
              "{activeRug.description}"
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              <span>کد اصالت سنجی: <strong className="font-mono text-amber-300">HMA-INT-{activeRug.id.toUpperCase()}</strong></span>
              <button
                onClick={() => window.print()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <i className="fa-solid fa-print"></i>
                <span>چپ / دانلود PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
