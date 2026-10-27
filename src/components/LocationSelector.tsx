import React, { useState } from 'react';
import { ALL_IRANIAN_PROVINCES } from '../constants/provincesData';
import { IranianProvince } from '../types';

interface LocationSelectorProps {
  selectedProvinceId: string;
  selectedCity: string;
  onSelectRegion: (provinceId: string, provinceNameFa: string, cityNameFa: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedProvinceId,
  selectedCity,
  onSelectRegion,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabProvince, setActiveTabProvince] = useState<IranianProvince | null>(null);

  // Quick feature chips
  const POPULAR_PROVINCES = [
    { id: 'all', nameFa: 'ایران (بازار سراسری)' },
    { id: 'tehran', nameFa: 'تهران' },
    { id: 'azarbaijan_east', nameFa: 'تبریز (آذربایجان شرقی)' },
    { id: 'isfahan', nameFa: 'اصفهان و کاشان' },
    { id: 'qom', nameFa: 'قم (ابریشم)' },
    { id: 'khorasan_razavi', nameFa: 'مشهد (خراسان رضوی)' },
    { id: 'fars', nameFa: 'شیراز (فارس)' },
    { id: 'kurdistan', nameFa: 'بیجار (کردستان)' },
  ];

  const currentProvince = ALL_IRANIAN_PROVINCES.find((p) => p.id === selectedProvinceId);
  const currentProvinceName = selectedProvinceId === 'all'
    ? 'سراسر کشور (ایران)'
    : currentProvince?.nameFa || 'استان انتخاب شده';

  // Filter provinces by search
  const filteredProvinces = ALL_IRANIAN_PROVINCES.filter((p) => {
    const matchName = p.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capitalFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.famousCarpetTypeFa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = p.cities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchName || matchCity;
  });

  return (
    <div className="space-y-3">
      {/* Location Selector Bar */}
      <div className="glass-card p-4 rounded-3xl border-2 border-amber-400 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-black">
            <i className="fa-solid fa-map-location-dot text-xl"></i>
          </div>

          <div>
            <div className="text-xs sm:text-sm text-white font-black flex items-center gap-2">
              <span className="text-amber-300">موقعیت جغرافیایی فعال بازار:</span>
              <span className="text-white text-xs bg-black px-2.5 py-0.5 rounded-lg border border-amber-400/70">(تفکیک استانی غرفه‌ها)</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white flex items-center gap-2 pt-1">
              <span className="text-amber-300">{currentProvinceName}</span>
              {selectedCity !== 'all' && (
                <span className="text-xs sm:text-sm font-black text-white bg-black px-3 py-1 rounded-xl border-2 border-amber-400">
                  شهر: {selectedCity}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Change Location Button */}
        <button
          onClick={() => setIsOpenModal(true)}
          className="px-5 py-3 rounded-2xl gold-grad text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition flex items-center gap-2 shrink-0"
        >
          <i className="fa-solid fa-building-flag"></i>
          <span>تغییر استان / شهر (۳۱ استان)</span>
        </button>
      </div>

      {/* Quick Location Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs sm:text-sm">
        <span className="text-xs sm:text-sm font-black text-white shrink-0 ml-1">دسترسی سریع:</span>
        {POPULAR_PROVINCES.map((p) => {
          const isSelected = selectedProvinceId === p.id && selectedCity === 'all';
          return (
            <button
              key={p.id}
              onClick={() => {
                if (p.id === 'all') {
                  onSelectRegion('all', 'سراسر کشور (ایران)', 'all');
                } else {
                  const found = ALL_IRANIAN_PROVINCES.find((x) => x.id === p.id);
                  onSelectRegion(p.id, found?.nameFa || p.nameFa, 'all');
                }
              }}
              className={`px-4 py-2 rounded-xl font-black whitespace-nowrap transition shrink-0 text-xs sm:text-sm ${
                isSelected
                  ? 'gold-grad text-slate-950 shadow-lg border-2 border-amber-300 scale-105'
                  : 'bg-black hover:bg-slate-900 text-white border-2 border-amber-400/70'
              }`}
            >
              <span>{p.nameFa}</span>
            </button>
          );
        })}
      </div>

      {/* 31 PROVINCES REGIONAL SELECTION MODAL */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] rounded-3xl p-5 sm:p-6 border border-amber-500/40 shadow-2xl flex flex-col space-y-4 overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="text-amber-300 font-black text-base sm:text-lg flex items-center gap-2">
                  <i className="fa-solid fa-sitemap text-amber-400"></i>
                  <span>دایرکتوری جغرافیایی استان‌ها و شهرهای ایران</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  تفکیک درخت‌واره: <code className="text-amber-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded">کشور (ایران) ➔ استان ➔ شهر ➔ حجره‌ها و آگهی‌ها</code>
                </div>
              </div>

              <button
                onClick={() => setIsOpenModal(false)}
                className="w-9 h-9 rounded-full bg-slate-900 text-slate-400 hover:text-slate-100 flex items-center justify-center border border-slate-800"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Search Input & Nationwide Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-3.5 text-slate-500 text-xs"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام استان، شهر یا سبک فرش (مثال: تبریز، کاشان، بیجار، ابریشم)..."
                  className="w-full pr-9 pl-3 py-2.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => {
                  onSelectRegion('all', 'سراسر کشور (ایران)', 'all');
                  setIsOpenModal(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl gold-grad text-slate-950 font-black text-xs shrink-0 shadow-lg"
              >
                🇮🇷 نمایش بازار سراسری کل ایران
              </button>
            </div>

            {/* Main Content Area - Split View or Province Grid */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-amber-500/20">
              {activeTabProvince ? (
                /* City Selector inside Chosen Province */
                <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs text-amber-300 font-bold">انتخاب شهر در استان:</div>
                      <div className="text-lg font-black gold-text">{activeTabProvince.nameFa}</div>
                      <div className="text-xs text-slate-400">{activeTabProvince.famousCarpetTypeFa}</div>
                    </div>

                    <button
                      onClick={() => setActiveTabProvince(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      <span>بازگشت به فهرست استان‌ها</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">شهر مورد نظر خود را انتخاب کنید:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => {
                          onSelectRegion(activeTabProvince.id, activeTabProvince.nameFa, 'all');
                          setIsOpenModal(false);
                          setActiveTabProvince(null);
                        }}
                        className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-black text-right hover:bg-amber-500/30 transition shadow"
                      >
                        🌟 کل استان {activeTabProvince.nameFa} (همه شهرها)
                      </button>

                      {activeTabProvince.cities.map((city, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onSelectRegion(activeTabProvince.id, activeTabProvince.nameFa, city);
                            setIsOpenModal(false);
                            setActiveTabProvince(null);
                          }}
                          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-bold text-right transition hover:bg-slate-900"
                        >
                          <i className="fa-solid fa-city text-amber-400 text-[10px] ml-1.5"></i>
                          <span>{city}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Province Grid (31 Provinces) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredProvinces.map((prov) => {
                    const isSelected = selectedProvinceId === prov.id;

                    return (
                      <div
                        key={prov.id}
                        className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between space-y-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-xl ring-1 ring-amber-400/30'
                            : 'bg-slate-900/80 border-slate-800/90 hover:border-amber-500/40 hover:bg-slate-900'
                        }`}
                        onClick={() => setActiveTabProvince(prov)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-amber-200 text-sm group-hover:text-amber-300">
                              {prov.nameFa}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                              مرکز: {prov.capitalFa}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-300 line-clamp-1 leading-relaxed">
                            <i className="fa-solid fa-gem text-amber-400 text-[10px] ml-1"></i>
                            <span>{prov.famousCarpetTypeFa}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span>{prov.activeBoothsCount || 10} حجره فعال</span>
                            <span>•</span>
                            <span>{prov.activeAdsCount || 25} آگهی</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTabProvince(prov);
                            }}
                            className="text-amber-300 font-bold text-[10px] bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-xl border border-amber-500/30 transition flex items-center gap-1"
                          >
                            <span>مشاهده شهرها ({prov.cities.length})</span>
                            <i className="fa-solid fa-chevron-left text-[8px]"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-amber-400"></i>
                <span>پلتفرم منطقه‌ای فرش ایران — ۳۱ استان زیر پوشش کامل</span>
              </div>

              <button
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
