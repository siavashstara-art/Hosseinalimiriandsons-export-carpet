import React, { useState } from 'react';
import { AppLang, CarpetListing } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';

interface MachineRugSectionProps {
  currentLang: AppLang;
}

export const MACHINE_RUGS: CarpetListing[] = [
  {
    id: 'mac-1',
    title: 'فرش ماشینی ۱۵۰۰ شانه تراکم ۴۵۰۰ (طرح اسلیمی تبریز)',
    category: 'machine',
    priceTomanMillion: 28.5,
    priceUSD: 470,
    boothName: 'غرفه فرش ماشینی کاشان فاخر',
    nationalIdMasked: '۱۲۸***۴۳۲۱',
    isVerifiedMerchant: true,
    city: 'کاشان',
    image: heroRugImg,
    description: '۱۵۰۰ شانه واقعی با تراکم ۴۵۰۰، دستباف‌نما، الیاف ۱۰۰٪ آکریلیک هیت‌ست بایر آلمان، ضد حساسیت و بدون پرز.',
    machineSpecs: {
      reedCount: 1500,
      density: 4500,
      fiberType: 'آکریلیک هیت‌ست آلمان (High-Bulk)',
      yarnOrigin: 'بایر آلمان (Bayer Germany)'
    }
  },
  {
    id: 'mac-2',
    title: 'فرش ماشینی ۱۲۰۰ شانه تراکم ۳۶۰۰ (طرح افشان گل‌برجسته)',
    category: 'machine',
    priceTomanMillion: 19.8,
    priceUSD: 330,
    boothName: 'حجره نوین فرش مشهد',
    nationalIdMasked: '۰۹۳***۷۶۵۴',
    isVerifiedMerchant: true,
    city: 'مشهد',
    image: heroRugImg,
    description: '۱۲۰۰ شانه گل‌برجسته، بافت ریز و لطیف، با ضمانتنامه ۱۰ ساله ثبت کارخانه.',
    machineSpecs: {
      reedCount: 1200,
      density: 3600,
      fiberType: 'آکریلیک هیت‌ست + نخ هایبالک',
      yarnOrigin: 'دراک بایر آلمان'
    }
  },
  {
    id: 'mac-3',
    title: 'فرش ماشینی ۷۰۰ شانه تراکم ۲۵۵۰ (طرح ریزماهی)',
    category: 'machine',
    priceTomanMillion: 12.2,
    priceUSD: 200,
    boothName: 'غرفه فرش ماشینی یزد',
    nationalIdMasked: '۴۴۱***۸۸۹۹',
    isVerifiedMerchant: true,
    city: 'یزد',
    image: heroRugImg,
    description: '۷۰۰ شانه با گوشت زیاد و خاب بلند، بسیار نرم و مقاوم برای پاخوری بالا.',
    machineSpecs: {
      reedCount: 700,
      density: 2550,
      fiberType: '۱۰۰٪ آکریلیک هیت‌ست',
      yarnOrigin: 'الیاف درالون ترکیه'
    }
  }
];

export const MachineRugSection: React.FC<MachineRugSectionProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [selectedReedFilter, setSelectedReedFilter] = useState<number | 'all'>('all');

  const filteredRugs = MACHINE_RUGS.filter((r) => {
    if (selectedReedFilter === 'all') return true;
    return r.machineSpecs?.reedCount === selectedReedFilter;
  });

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-industry text-amber-400"></i>
            <span>بخش مجزای فرش ماشینی (شفافیت کامل شانه و تراکم)</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            تفکیک مطلق جهت جلوگیری از عرضه فرش ماشینی به عنوان دستباف و تضمین اصالت فنی
          </p>
        </div>

        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold border border-indigo-500/30">
          ⚙️ فرش ماشینی با برچسب استاندارد
        </span>
      </div>

      {/* Reed Count Filters (شانه و تراکم) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-400 font-bold me-1">فیلتر شانه:</span>
        <button
          onClick={() => setSelectedReedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            selectedReedFilter === 'all'
              ? 'gold-grad text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          همه شانات
        </button>
        <button
          onClick={() => setSelectedReedFilter(1500)}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            selectedReedFilter === 1500
              ? 'gold-grad text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          ۱۵۰۰ شانه (تراکم ۴۵۰۰)
        </button>
        <button
          onClick={() => setSelectedReedFilter(1200)}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            selectedReedFilter === 1200
              ? 'gold-grad text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          ۱۲۰۰ شانه (تراکم ۳۶۰۰)
        </button>
        <button
          onClick={() => setSelectedReedFilter(700)}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            selectedReedFilter === 700
              ? 'gold-grad text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          ۷۰۰ شانه (تراکم ۲۵۵۰)
        </button>
      </div>

      {/* Rug Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {filteredRugs.map((rug) => (
          <div
            key={rug.id}
            className="glass-card rounded-2xl p-4 space-y-3 bg-slate-900/60 hover:border-amber-500/50 transition"
          >
            <div className="relative rounded-xl overflow-hidden h-44 bg-slate-950 border border-slate-800">
              <img src={rug.image} alt={rug.title} className="w-full h-full object-cover" />
              <span className="absolute top-2.5 right-2.5 bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] shadow">
                فرش ماشینی {rug.machineSpecs?.reedCount} شانه
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-amber-200 text-xs line-clamp-1">{rug.title}</h3>
              <div className="text-[11px] text-slate-400">
                غرفه: <strong className="text-slate-200 me-2">{rug.boothName}</strong> | شهر: <strong className="text-slate-200">{rug.city}</strong>
              </div>
            </div>

            {rug.machineSpecs && (
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div><span className="text-slate-400">شانه:</span> <strong className="text-amber-300 block">{rug.machineSpecs.reedCount} شانه</strong></div>
                <div><span className="text-slate-400">تراکم:</span> <strong className="text-amber-300 block">{rug.machineSpecs.density} تراکم</strong></div>
                <div><span className="text-slate-400">جنس نخ:</span> <strong className="text-slate-200 block truncate">{rug.machineSpecs.fiberType}</strong></div>
                <div><span className="text-slate-400">منشا نخ:</span> <strong className="text-slate-200 block truncate">{rug.machineSpecs.yarnOrigin}</strong></div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="font-black text-emerald-400 font-mono">
                {rug.priceTomanMillion} میلیون تومان
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                (~${rug.priceUSD} USD)
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
