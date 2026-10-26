import React, { useState, useRef, useEffect } from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';
import defaultRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';

interface StoryCreatorProps {
  currentLang: AppLang;
}

export const StoryCreator: React.FC<StoryCreatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [title, setTitle] = useState<string>('قالیچه تبریز ۶۰ رج چله ابریشم');
  const [details, setDetails] = useState<string>('گل‌برجسته / رنگرزی گیاهی سنتی / استادباف');
  const [price, setPrice] = useState<string>('تماس جهت استعلام قیمت');
  const [phone, setPhone] = useState<string>('۰۹۱۲۱۲۳۴۵۶۷');

  const [theme, setTheme] = useState<'gold' | 'obsidian' | 'eslimi' | 'minimal'>('gold');
  const [format, setFormat] = useState<'story' | 'post'>('story');
  const [imageSrc, setImageSrc] = useState<string>(defaultRugImg);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isStory = format === 'story';
    const W = 1080;
    const H = isStory ? 1920 : 1080;

    canvas.width = W;
    canvas.height = H;

    // Background Gradient Fill
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (theme === 'gold') {
      bg.addColorStop(0, '#0a0d1a');
      bg.addColorStop(0.5, '#040711');
      bg.addColorStop(1, '#111827');
    } else if (theme === 'obsidian') {
      bg.addColorStop(0, '#030712');
      bg.addColorStop(1, '#0f172a');
    } else if (theme === 'eslimi') {
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(1, '#1e1b4b');
    } else {
      bg.addColorStop(0, '#18181b');
      bg.addColorStop(1, '#09090b');
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Outer Decorative Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    // Draw Rug Image
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        const padding = 80;
        const imgX = padding;
        const imgY = isStory ? 280 : 160;
        const imgW = W - padding * 2;
        const imgH = isStory ? 1000 : 560;

        ctx.fillStyle = '#000000';
        ctx.fillRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);
        ctx.drawImage(img, imgX, imgY, imgW, imgH);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 6;
        ctx.strokeRect(imgX, imgY, imgW, imgH);

        // Header Title
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 50px Vazirmatn, sans-serif';
        ctx.fillText('فرش حسین علی میری و پسران', W / 2, isStory ? 140 : 95);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '26px Vazirmatn, sans-serif';
        ctx.fillText('بازار فرش ایران و جهان — ارائه‌ای از فرش حسین علی میری و پسران', W / 2, isStory ? 195 : 135);

        // Details Banner Box
        const bannerY = isStory ? 1330 : 750;
        const bannerH = isStory ? 210 : 160;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(imgX, bannerY, imgW, bannerH);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(imgX, bannerY, imgW, bannerH);

        // Rug Title
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 44px Vazirmatn, sans-serif';
        wrapText(ctx, title || 'عنوان فرش دستباف', W / 2, bannerY + 60, imgW * 0.9, 50);

        // Rug Details
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '30px Vazirmatn, sans-serif';
        wrapText(ctx, details || 'مشخصات چله ابریشم', W / 2, bannerY + 130, imgW * 0.9, 40);

        // Price & Phone
        const priceY = isStory ? 1570 : 930;
        ctx.fillStyle = '#d97706';
        ctx.fillRect(imgX, priceY, imgW, 85);

        ctx.fillStyle = '#030712';
        ctx.font = 'bold 36px Vazirmatn, sans-serif';
        ctx.fillText(`قیمت: ${price} | 📞 ${phone}`, W / 2, priceY + 54);

        // Watermark Seal Footer
        const footerY = isStory ? 1780 : 1030;
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 26px Vazirmatn, sans-serif';
        ctx.fillText(
          '🔒 اکوسیستم آفرینش | اثر آقای اکبر علیمیری | فرش حسین علی میری و پسران',
          W / 2,
          footerY
        );

        canvas.toBlob((blob) => {
          if (blob) {
            setDownloadBlob(blob);
            setDownloadUrl(URL.createObjectURL(blob));
          }
        }, 'image/png');
      };
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [title, details, price, phone, theme, format, imageSrc]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Alimiri_Rug_Story_${Date.now()}.png`;
    a.click();
  };

  const handleShare = async () => {
    if (!downloadBlob) return;
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([downloadBlob], 'Alimiri_Story.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title || 'فرش حسین علی میری و پسران',
            text: `${title} - ${details}`,
            files: [file],
          });
          return;
        }
      } catch (e) {
        // Fallback
      }
    }
    handleDownload();
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
        {/* Story Inputs Form */}
        <div className="space-y-3.5">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.phStoryTitle}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none text-xs font-bold"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-400">مشخصات (چله، طرح):</label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t.phStoryDetails}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-400">قیمت:</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t.phStoryPrice}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">شماره تماس:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phStoryPhone}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-bold focus:border-amber-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block mb-1 text-slate-400">قالب تصویر:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none text-xs font-semibold"
              >
                <option value="story">{t.formatStory}</option>
                <option value="post">{t.formatPost}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">تم رنگی قاب:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
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

        {/* Story Preview & Share / Download Controls */}
        <div className="flex flex-col items-center justify-center border border-slate-800 rounded-2xl p-4 bg-slate-950/80 space-y-4">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <i className="fa-solid fa-eye"></i>
            <span>{t.previewTitle}</span>
          </div>

          <div className="relative border-2 border-amber-500/40 rounded-xl overflow-hidden max-h-[360px] shadow-2xl">
            <canvas
              ref={canvasRef}
              className="max-h-[350px] w-auto object-contain rounded-lg"
            ></canvas>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <button
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <i className="fa-solid fa-download text-sm"></i>
              <span>{t.downloadBtn}</span>
            </button>

            <button
              onClick={handleShare}
              className="gold-grad hover:opacity-95 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <i className="fa-solid fa-share-nodes text-sm"></i>
              <span>{t.shareBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
