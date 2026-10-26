import React from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface CreatorProfileProps {
  currentLang: AppLang;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const projects = [
    { name: 'سالنیار (Salonyar)', desc: 'سامانه مدیریت و اتوماسیون سالن‌ها' },
    { name: 'سالنیار بیوتی / زیبایار', desc: 'پلتفرم تخصصی صنعت زیبایی و آرایشگاهی' },
    { name: 'ساختمانیار', desc: 'مدیریت هوشمند پروژه و بازار ساختمان' },
    { name: 'خدماتیار', desc: 'سامانه جامع درخواست و مدیریت خدمات' },
    { name: 'نکزوز (Nexus Open Mind)', desc: 'پلتفرم هوش مصنوعی پیشرفته و هوش عمومی' },
    { name: 'بازار فرش دستباف AI', desc: 'دستیار، رجشمار و کارشناسی هوشمند فرش' },
    { name: 'تانافورک (TavanaFork)', desc: 'ابزار توسعه و فورک نرم‌افزاری' },
    { name: 'تانابیوتی (TavanaBeauty)', desc: 'شبکه اکوسیستم زیبایی توانا' },
    { name: 'تاناجوکیشن (TavanaEducation)', desc: 'سامانه آموزش و آکادمی تخصصی' },
    { name: 'تانافریلنسر (TavanaFreelancer)', desc: 'پلتفرم دورکاری و پروژه‌های آزاد' },
    { name: 'ایجنت توانا (Agent Tavana)', desc: 'کارگزاران خودکار هوش مصنوعی' },
    { name: 'تانامسترها (TavanaMasters)', desc: 'شبکه اساتید و خبرگان صنعت' },
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
            <span>پروژه‌ها و سامانه‌های شاخص اکوسیستم آفرینش:</span>
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
