import React from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface EthicalCharterProps {
  currentLang: AppLang;
  onClose?: () => void;
}

export const EthicalCharter: React.FC<EthicalCharterProps> = ({ currentLang, onClose }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const rules = [
    {
      num: '01',
      icon: 'fa-dove',
      titleFa: 'ممنوعیت مطلق سیاسی و نظامی (صلح و هنر جهانی)',
      titleEn: 'Absolute Political & Military Neutrality',
      descFa: 'فرش دستباف، سفیر بی‌بدیل صلح، فرهنگ و هنر فاخر است. هرگونه تبلیغ، بنر، شعار یا جهت‌گیری سیاسی، نظامی، حزبی یا فرقه‌ای در پلتفرم به صورت مطلق ممنوع می‌باشد.',
      descEn: 'Handmade carpets are universal ambassadors of peace and art. All political, military, or sectarian slogans and advertisements are strictly prohibited.'
    },
    {
      num: '02',
      icon: 'fa-handshake-simple',
      titleFa: 'احترام متقابل و منع نژادپرستی',
      titleEn: 'Mutual Respect & Zero Racial / Religious Discrimination',
      descFa: 'احترام به کلیه ادیان، مذاهب، اقوام، قومیت‌ها و فرهنگ‌های جهانی الزامی است. هرگونه توهین، افترا یا تبعیض نژادی موجب مسدودی دائم حساب خواهد شد.',
      descEn: 'Universal respect for all religions, races, and cultures is mandatory. Any hate speech or discrimination results in an immediate permanent ban.'
    },
    {
      num: '03',
      icon: 'fa-shield-halved',
      titleFa: 'حفاظت مطلق از کرامت انسان (خط قرمز روی کودکان و زنان)',
      titleEn: 'Protection of Human Dignity (Zero Exploitation)',
      descFa: 'هرگونه استفاده ابزاری، بهره‌کشی، کار اجباری یا انتشار تصاویر نامناسب از زنان و کودکان در عکاسی فرش‌ها ممنوع است. تمرکز عکاسی صرفاً روی اصالت گره‌ها و هنر فرش می‌باشد.',
      descEn: 'Zero exploitation or forced labor. Photo displays must strictly focus on carpet craftsmanship, weave density, and artistic merit.'
    },
    {
      num: '04',
      icon: 'fa-certificate',
      titleFa: 'تضمین اصالت و منع غش در معامله',
      titleEn: 'Authenticity Guarantee & Fraud Prohibition',
      descFa: 'ارائه هرگونه اطلاعات نادرست، پنهان‌کاری مرمت، عیوب ناگفته یا مغایرت عمدی بین فرش معرفی‌شده و کالای تحویلی شرعاً و قانوناً ممنوع است.',
      descEn: 'Concealing flaws or delivering mismatched goods is strictly forbidden under binding international escrow terms.'
    },
    {
      num: '05',
      icon: 'fa-scale-balanced',
      titleFa: 'صیانت از قیمت عادلانه (منع غبن فاحش)',
      titleEn: 'Fair Pricing & Anti-Extortion Governance',
      descFa: 'ارزش‌گذاری و فروش فرش باید بر اساس موازین عادلانه بازار، تراکم گره، قدمت و کیفیت مواد اولیه باشد. قیمت‌گذاری کاذب یا اجحاف‌سنگین غیرقانونی می‌باشد.',
      descEn: 'All rug valuations must reflect fair market metrics, knot density, raw materials, and verified provenance.'
    }
  ];

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl border-2 border-amber-500/50 relative overflow-hidden bg-slate-950/90 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black gold-text">
              منشور اخلاقی، خط‌قرمزها و ضوابط حقوقی پلتفرم
            </h2>
            <span className="text-[11px] text-slate-400">
              Zero Tolerance Charter & Legal Principles — امپراتوری فرش ایران و جهان
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        )}
      </div>

      {/* Rules List Grid */}
      <div className="grid gap-4">
        {rules.map((r, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold shrink-0">
              {r.num}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-amber-200 text-xs md:text-sm flex items-center gap-2">
                <i className={`fa-solid ${r.icon} text-amber-400`}></i>
                <span>{currentLang === 'en' ? r.titleEn : r.titleFa}</span>
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                {currentLang === 'en' ? r.descEn : r.descFa}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Commitment Statement */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-bold">
        🛡️ تمامی کاربران با عضویت و استفاده از امکانات، تعهد قلبی و قانونی به رعایت این ضوابط دارند.
      </div>
    </div>
  );
};
