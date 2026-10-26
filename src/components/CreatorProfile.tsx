import React from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface CreatorProfileProps {
  currentLang: AppLang;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const projects = [
    { name: 'سالنیار (Salonyar)', desc: 'سامانه مدیریت و اتوماسیون سالن‌ها و زیبایی' },
    { name: 'ساختمانیار (Sakhtmanyar)', desc: 'مدیریت هوشمند پروژه و بازار مصالح ساختمان' },
    { name: 'کلینیک‌یار (Clinicyar)', desc: 'مدیریت هوشمند کلینیک و نوبت‌دهی پزشکی' },
    { name: 'دکورمیت (Decormit)', desc: 'پلتفرم دکوراسیون داخلی و معماری مدرن' },
    { name: 'دنتال‌بار (Dentalbar)', desc: 'سامانه تخصصی تجهیزات و کلینیک‌های دندانپزشکی' },
    { name: 'نکسوس هوش مصنوعی (Nexus AI)', desc: 'پلتفرم پیشرفته هوش مصنوعی و پردازش هوشمند' },
    { name: 'لینگووی توانا (Linguoy)', desc: 'آموزش تخصصی زبان فارسی به انگلیسی‌زبانان و بالعکس' },
    { name: 'توانا فریلنسر (Tavana Freelancer)', desc: 'پلتفرم دورکاری و پروژه‌های فنی و تخصصی' },
    { name: 'توانا اجوکیشن (Tavana Education)', desc: 'سامانه آموزش آنلاین و آکادمی تخصصی' },
    { name: 'توانا فورگ (Tavana Fork)', desc: 'ابزار توسعه، مدیریت مخازن و فورک نرم‌افزاری' },
    { name: 'تی دپلوی (T-Deploy)', desc: 'پلتفرم استقرار خودکار و ابری اپلیکیشن‌ها' },
    { name: 'خدماتیار (Khedmatyar)', desc: 'سامانه جامع درخواست و مدیریت خدمات شهری' },
    { name: 'وانپرویدی (1P / Wanproy)', desc: 'موتور شتاب‌دهنده ساخت و توسعه نرم‌افزار' },
    { name: 'بازار بزرگ فرش ایران و جهان', desc: 'پلتفرم جامع اصالت‌سنجی و تجارت بین‌المللی فرش' },
  ];

  return (
    <section className="glass-card rounded-2xl p-6 space-y-5 border border-amber-500/40 text-xs shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-id-card text-amber-400 text-lg"></i>
          <span>{t.creatorTitle}</span>
        </h2>
        <span className="text-[11px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
          آقای اکبر علیمیری
        </span>
      </div>

      <div className="space-y-4 text-slate-200 leading-relaxed">
        {/* Copyright notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <strong className="text-amber-300 font-bold me-1">مالکیت معنوی و انحصاری:</strong>
          <span>{t.copyrightText}</span>
        </div>

        {/* Creator Bio */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
            <i className="fa-solid fa-user-gear"></i>
            <span>درباره خالق اثر:</span>
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            {t.creatorBio}
          </p>
        </div>

        {/* Projects List Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
            <i className="fa-solid fa-cubes text-amber-400"></i>
            <span>پروژه‌ها و اکوسیستم نرم‌افزارهای تخصصی توسعه‌دنده:</span>
          </h3>
          <p className="text-slate-400 text-[11px]">
            {t.projectsList}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition"
              >
                <div className="font-bold text-amber-200 text-xs">{proj.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{proj.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
