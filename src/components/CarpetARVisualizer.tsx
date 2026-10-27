import React, { useState, useRef } from 'react';
import { AppLang } from '../types';

interface CarpetARVisualizerProps {
  currentLang: AppLang;
}

interface RoomPreset {
  id: string;
  titleFa: string;
  image: string;
  floorTypeFa: string;
}

interface CarpetSample {
  id: string;
  titleFa: string;
  sizeFa: string;
  originFa: string;
  image: string;
  priceTomanFa: string;
}

export const CarpetARVisualizer: React.FC<CarpetARVisualizerProps> = ({ currentLang }) => {
  const rooms: RoomPreset[] = [
    {
      id: 'modern_living',
      titleFa: 'سالن پذیرایی مدرن (کف سرامیک روشن)',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      floorTypeFa: 'سرامیک نانو پولیش ۸۰×۸۰',
    },
    {
      id: 'classic_luxury',
      titleFa: 'پذیرایی کلاسیک و سلطنتی (کف پارکت چوب بلوط)',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      floorTypeFa: 'پارکت چوب طبیعی با مبلمان استیل',
    },
    {
      id: 'cozy_lounge',
      titleFa: 'نشیمن گرم و صمیمی (دکور مینیمال ایرانی)',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      floorTypeFa: 'میکروسمنت خنثی',
    },
  ];

  const carpets: CarpetSample[] = [
    {
      id: 'tabriz_50',
      titleFa: 'قالی ۶ متری لچک‌ترنج ابریشم تبریز',
      sizeFa: '۲ × ۳ متر (۶ متری)',
      originFa: 'تبریز - ۵۰ رج اعلا',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      priceTomanFa: '۳۴۰ میلیون تومان',
    },
    {
      id: 'isfahan_seirafian',
      titleFa: 'قالی ۹ متری افشان اصفهان صیرفیان',
      sizeFa: '۲.۵ × ۳.۵ متر (۹ متری)',
      originFa: 'اصفهان - چله ابریشم',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      priceTomanFa: '۶۸۰ میلیون تومان',
    },
    {
      id: 'qom_silk',
      titleFa: 'قالیچه ذرع و نیم تمام ابریشم قم',
      sizeFa: '۱ × ۱.۵ متر (ذرع و نیم)',
      originFa: 'قم - ۱۰۰٪ ابریشم خالص',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
      priceTomanFa: '۱۹۵ میلیون تومان',
    },
  ];

  const [selectedRoomId, setSelectedRoomId] = useState<string>('modern_living');
  const [selectedCarpetId, setSelectedCarpetId] = useState<string>('tabriz_50');
  const [userRoomImage, setUserRoomImage] = useState<string | null>(null);

  // 3D Perspective controls
  const [scale, setScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [tilt, setTilt] = useState<number>(55);
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(75);
  const [shadowOpacity, setShadowOpacity] = useState<number>(65);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const selectedCarpet = carpets.find((c) => c.id === selectedCarpetId) || carpets[0];
  const activeBackground = userRoomImage || selectedRoom.image;

  const handleCustomRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserRoomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setScale(100);
    setRotation(0);
    setTilt(55);
    setPosX(0);
    setPosY(75);
    setShadowOpacity(65);
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border-2 border-amber-400 bg-black space-y-3 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
              <i className="fa-solid fa-cube text-2xl"></i>
            </span>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-lg text-xs font-black">
                <i className="fa-solid fa-vr-cardboard text-amber-400"></i>
                <span>فناوری واقعیت افزوده و هوش مصنوعی سه‌بعدی</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                شبیه‌ساز چیدمان واقعیت افزوده فرش در منزل (AR Visualizer)
              </h2>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-950 border-2 border-amber-400 text-white text-xs font-black flex items-center gap-2">
            <i className="fa-solid fa-camera text-amber-400"></i>
            <span>تطبیق ابعاد با مبلمان و سرامیک</span>
          </div>
        </div>

        <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
          پیش از خرید و پرداخت، فرش را به صورت سه‌بعدی روی کف اتاق، سالن پذیرایی یا دفتر کار خود پرو کنید. ابعاد، چرخش و زاویه پرسپکتیو را تنظیم کنید و عکس چیدمان را ذخیره یا برای همسر و مشتری بفرستید.
        </p>
      </div>

      {/* Main AR Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AR Stage Viewport */}
        <div className="lg:col-span-8 space-y-3">
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-amber-400 bg-slate-950 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex items-center justify-center select-none"
          >
            {/* Background Room Image */}
            <img
              src={activeBackground}
              alt="Room Background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Depth Dimmer for realistic ambient occlusion */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

            {/* 3D Carpet Floor Projected Node */}
            <div
              className="absolute transition-transform duration-75 pointer-events-none flex items-center justify-center"
              style={{
                bottom: `${posY}%`,
                left: `calc(50% + ${posX}px)`,
                transform: `translateX(-50%) perspective(700px) rotateX(${tilt}deg) rotateZ(${rotation}deg) scale(${scale / 100})`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Natural Floor Drop Shadow */}
              <div
                className="absolute inset-0 rounded-lg blur-md transition-opacity"
                style={{
                  backgroundColor: '#000000',
                  opacity: shadowOpacity / 100,
                  transform: 'scale(1.05) translateY(12px)',
                }}
              ></div>

              {/* High-Resolution Carpet Image with Natural Weave Feel */}
              <div className="relative border-2 border-amber-400/80 rounded-sm shadow-2xl overflow-hidden bg-amber-950/40">
                <img
                  src={selectedCarpet.image}
                  alt={selectedCarpet.titleFa}
                  className="w-72 sm:w-80 md:w-96 aspect-[3/4] object-cover"
                />
                {/* Fringe Tassels Graphic Hint */}
                <div className="h-2 w-full bg-amber-100/80 border-t border-amber-300/60"></div>
              </div>
            </div>

            {/* Watermark HUD Badge */}
            <div className="absolute top-4 right-4 bg-black/90 text-white border-2 border-amber-400 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>پرو واقعیت افزوده: {selectedCarpet.titleFa}</span>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/90 text-amber-300 border border-amber-400 px-3 py-1 rounded-xl text-[11px] font-black shadow-xl">
              نشان رسمی حجره حاج حسین‌علی میری و پسران
            </div>
          </div>

          {/* Quick HUD Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border-2 border-amber-400/80 text-white">
            <div className="flex items-center gap-2 text-xs font-bold">
              <i className="fa-solid fa-tag text-amber-400"></i>
              <span>قیمت این تخته فرش:</span>
              <span className="text-amber-400 font-black text-sm">{selectedCarpet.priceTomanFa}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition"
              >
                <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
                <span>بازنشانی زاویه</span>
              </button>

              <button
                onClick={() => {
                  alert('تصویر پرو فرش در اتاق شما با موفقیت ذخیره شد. هم‌اکنون می‌توانید آن را در تلگرام و واتساپ ارسال فرمایید.');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black border-2 border-white flex items-center gap-1.5 shadow active:scale-95 transition"
              >
                <i className="fa-solid fa-camera"></i>
                <span>عکسبرداری و اشتراک با مشتری</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Carpet Selector */}
          <div className="glass-card p-4 rounded-2xl border-2 border-amber-400 bg-black space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-rug text-amber-400"></i>
              <span>انتخاب فرش برای تست چیدمان:</span>
            </h3>
            <div className="space-y-2">
              {carpets.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCarpetId(c.id)}
                  className={`w-full p-2.5 rounded-xl border-2 text-right transition flex items-center gap-2.5 ${
                    selectedCarpetId === c.id
                      ? 'bg-amber-400 text-slate-950 border-white font-black shadow-lg'
                      : 'bg-slate-950 text-white border-amber-400/40 hover:border-amber-400'
                  }`}
                >
                  <img src={c.image} alt={c.titleFa} className="w-10 h-10 rounded-lg object-cover border border-amber-400 shrink-0" />
                  <div className="truncate text-xs">
                    <div className="font-black">{c.titleFa}</div>
                    <div className="text-[10px] opacity-80">{c.sizeFa} • {c.originFa}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Room / Camera Selector */}
          <div className="glass-card p-4 rounded-2xl border-2 border-amber-400 bg-black space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-house text-amber-400"></i>
              <span>محیط اتاق یا دوربین منزل شما:</span>
            </h3>

            <div className="space-y-1.5">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRoomId(r.id);
                    setUserRoomImage(null);
                  }}
                  className={`w-full p-2 rounded-xl border text-right transition text-xs font-bold flex items-center justify-between ${
                    selectedRoomId === r.id && !userRoomImage
                      ? 'bg-amber-400 text-slate-950 border-white font-black'
                      : 'bg-slate-950 text-white border-amber-400/40 hover:border-amber-400'
                  }`}
                >
                  <span>{r.titleFa}</span>
                  <span className="text-[10px] opacity-80">{r.floorTypeFa.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Custom Camera Upload */}
            <div className="pt-1">
              <label className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border-2 border-dashed border-amber-400/80 hover:border-amber-300 text-amber-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow">
                <i className="fa-solid fa-camera text-sm"></i>
                <span>عکسبرداری زنده از کف اتاق خودتان</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomRoomUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 3D Perspective Controls */}
          <div className="glass-card p-4 rounded-2xl border-2 border-amber-400 bg-black space-y-3 shadow-xl text-white">
            <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-amber-400"></i>
              <span>تنظیم ابعاد، چرخش و پرسپکتیو کف:</span>
            </h3>

            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>بزرگ‌نمایی و مقیاس فرش:</span>
                <span className="text-amber-400 font-mono font-black">{scale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>چرخش زاویه فرش (درجه):</span>
                <span className="text-amber-400 font-mono font-black">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Tilt / Perspective */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>شیب خواب فرش روی زمین (Tilt):</span>
                <span className="text-amber-400 font-mono font-black">{tilt}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="75"
                value={tilt}
                onChange={(e) => setTilt(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Y Position */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>فاصله از دوربین (عمق اتاق):</span>
                <span className="text-amber-400 font-mono font-black">{posY}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
