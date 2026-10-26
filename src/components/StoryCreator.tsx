import React, { useState, useRef, useEffect } from 'react';
import { AppLang, StoryConfig } from '../types';
import { i18n } from '../constants/translations';
import defaultRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';
import brandCrestImg from '../assets/images/alimiri_brand_crest_1792998593279.jpg';

interface StoryCreatorProps {
  currentLang: AppLang;
}

export const StoryCreator: React.FC<StoryCreatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const [config, setConfig] = useState<StoryConfig>({
    title: 'قالیچه تبریز ۶۰ رج چله ابریشم',
    details: 'گل‌برجسته / رنگرزی گیاهی سنتی / استادباف',
    price: 'تماس جهت استعلام قیمت',
    contact: 'حجره مرکزی فرش میری | ۰۹۱۲۱۲۳۴۵۶۷',
    theme: 'gold',
    format: 'story',
    imageSrc: defaultRugImg,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setConfig((prev) => ({ ...prev, imageSrc: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size depending on format
    const isStory = config.format === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // Background fill
    if (config.theme === 'gold') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0a0d1a');
      grad.addColorStop(0.5, '#040711');
      grad.addColorStop(1, '#111827');
      ctx.fillStyle = grad;
    } else if (config.theme === 'obsidian') {
      ctx.fillStyle = '#030712';
    } else if (config.theme === 'eslimi') {
      ctx.fillStyle = '#0f172a';
    } else {
      ctx.fillStyle = '#18181b';
    }
    ctx.fillRect(0, 0, width, height);

    // Decorative Gold Border Frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Draw Carpet Image
    if (config.imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.imageSrc;
      img.onload = () => {
        const padding = 80;
        const imgX = padding;
        const imgY = isStory ? 280 : 160;
        const imgW = width - padding * 2;
        const imgH = isStory ? 1000 : 580;

        // Draw image frame
        ctx.fillStyle = '#000000';
        ctx.fillRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);

        ctx.drawImage(img, imgX, imgY, imgW, imgH);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 6;
        ctx.strokeRect(imgX, imgY, imgW, imgH);

        // Header Title Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 54px Vazirmatn, sans-serif';
        ctx.fillText('فرش حسینعلی میری و پسران', width / 2, isStory ? 140 : 100);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '30px Vazirmatn, sans-serif';
        ctx.fillText('بازار بزرگ فرش ایران | H. ALIMIRI & SONS', width / 2, isStory ? 195 : 140);

        // Carpet Title Banner
        const bannerY = isStory ? 1340 : 780;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(imgX, bannerY, imgW, isStory ? 200 : 160);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(imgX, bannerY, imgW, isStory ? 200 : 160);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 44px Vazirmatn, sans-serif';
        ctx.fillText(config.title || 'عنوان فرش دستباف', width / 2, bannerY + 65);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '32px Vazirmatn, sans-serif';
        ctx.fillText(config.details || 'مشخصات فنی و چله ابریشم', width / 2, bannerY + 125);

        // Price & Contact Banner
        const priceY = isStory ? 1570 : 960;
        ctx.fillStyle = '#d97706';
        ctx.fillRect(imgX, priceY, imgW, 90);

        ctx.fillStyle = '#030712';
        ctx.font = 'bold 38px Vazirmatn, sans-serif';
        ctx.fillText(config.price || 'تماس بگیرید', width / 2, priceY + 58);

        // Watermark Seal Footer
        const footerY = isStory ? 1780 : 1030;
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 26px Vazirmatn, sans-serif';
        ctx.fillText(
          `🔒 اثر ثبت شده و انحصاری | ${config.contact} | واترمارک رسمی فرش میری`,
          width / 2,
          footerY
        );

        setDownloadUrl(canvas.toDataURL('image/png'));
      };
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [config]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Alimiri_Carpet_${config.format}_${Date.now()}.png`;
    a.click();
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-photo-film text-amber-400 text-lg"></i>
          <span>{t.storyTitle}</span>
        </h2>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
          {t.freeBadge}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Story Generator Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-slate-300 font-semibold">{t.photoLabel}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 file:bg-amber-500 file:text-slate-950 file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-400">عنوان فرش:</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="مثلاً: قالیچه تبریز ۶۰ رج"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none text-xs font-bold"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-400">مشخصات فنی و چله:</label>
            <input
              type="text"
              value={config.details}
              onChange={(e) => setConfig({ ...config, details: e.target.value })}
              placeholder="مشخصات (چله ابریشم، گلبرجسته)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-400">قیمت / شرایط فروش:</label>
            <input
              type="text"
              value={config.price}
              onChange={(e) => setConfig({ ...config, price: e.target.value })}
              placeholder="قیمت یا تماس بگیرید"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none text-xs"
            />
          </div>

          {/* Theme & Format Selectors */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block mb-1 text-slate-400">قالب تصویر:</label>
              <select
                value={config.format}
                onChange={(e) =>
                  setConfig({ ...config, format: e.target.value as 'story' | 'post' })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none text-xs font-semibold"
              >
                <option value="story">{t.formatStory}</option>
                <option value="post">{t.formatPost}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">تم رنگی قاب:</label>
              <select
                value={config.theme}
                onChange={(e) =>
                  setConfig({ ...config, theme: e.target.value as any })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none text-xs font-semibold"
              >
                <option value="gold">{t.themeGold}</option>
                <option value="obsidian">{t.themeObsidian}</option>
                <option value="eslimi">{t.themeEslimi}</option>
                <option value="minimal">{t.themeMinimal}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Story Preview & Download Canvas */}
        <div className="flex flex-col items-center justify-center border border-slate-800 rounded-2xl p-4 bg-slate-950/80 space-y-4">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <i className="fa-solid fa-eye"></i>
            <span>{t.previewTitle}</span>
          </div>

          {/* Canvas Element */}
          <div className="relative border-2 border-amber-500/40 rounded-xl overflow-hidden max-h-[360px] shadow-2xl">
            <canvas
              ref={canvasRef}
              className="max-h-[350px] w-auto object-contain rounded-lg"
            ></canvas>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <i className="fa-solid fa-download text-sm"></i>
            <span>{t.downloadBtn}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
