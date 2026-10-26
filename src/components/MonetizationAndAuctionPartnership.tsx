import React from 'react';
import { AppLang } from '../types';

interface MonetizationPartnershipProps {
  currentLang: AppLang;
}

export const MonetizationAndAuctionPartnership: React.FC<MonetizationPartnershipProps> = ({ currentLang }) => {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-500/30 space-y-8 bg-slate-950/90">
      {/* Top Banner Title */}
      <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black shadow-inner border border-amber-500/40">
          <i className="fa-solid fa-handshake text-amber-400"></i>
          <span>تعرفه‌های اقتصادی، بسته‌های تبلیغاتی و همکاری با حراجی‌های آنتیک</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
          سیاست‌های درآمدی پلتفرم و تعامل با حراجی‌های بین‌المللی فرش کهنه
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          مدل شفاف هزینه‌های آگهی پس از اتمام سهمیه رایگان، تعرفه خدمات تبلیغاتی، و اعلام آمادگی کامل برای مشارکت با حراجی‌ها و اکشن‌های تخصصی فرش‌های عتیقه.
        </p>
      </div>

      {/* 1. Partnership with Antique & Vintage Carpet Auction Houses */}
      <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-landmark text-amber-400"></i>
          <span>اعلام آمادگی برای همکاری و تعامل با حراجی‌ها و اکسن‌های فرش‌های کهنه و آنتیک</span>
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          پلتفرم تخصصی حسنعلی میری و فرزندان به طور رسمی اعلام می‌دارد که آمادگی کامل دارد تا با کلیه **حراجی‌های معتبر داخلی و بین‌المللی، اکسن‌ها (Action Houses) و کلکسیونرهای فرش‌های کهنه، عتیقه و نیمه‌عتیقه** وارد تعامل، هم‌افزایی و مشارکت استراتژیک شود.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-200 text-xs">ارزیابی قدمت و اصالت</h4>
            <p className="text-[11px] text-slate-400">همکاری در کارشناسی دقیق قدمت، متریال و ارزش‌گذاری حراجی‌های عتیقه.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-200 text-xs">اتاق مزایده اختصاصی</h4>
            <p className="text-[11px] text-slate-400">در اختیار گذاشتن زیرساخت اتاق مزایده زمان‌دار برای حراجی‌های بزرگ کهنه.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-200 text-xs">معرفی به خریداران جهانی</h4>
            <p className="text-[11px] text-slate-400">پوشش چندزبانه (۸ زبان) برای جذب خریداران و موزه‌های بین‌المللی.</p>
          </div>
        </div>
      </div>

      {/* 2. Ad Pricing After Free Quota */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-amber-500/30 bg-slate-900/80">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-black text-amber-300 text-sm flex items-center gap-2">
              <i className="fa-solid fa-rectangle-ad text-amber-400"></i>
              <span>تعرفه آگهی‌های مازاد (پس از اتمام سهمیه رایگان)</span>
            </h3>
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">عادی vs اولویت‌دار</span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-200 text-xs">آگهی عادی (انتشار ۳۰ روزه در استان)</h4>
                <p className="text-[11px] text-slate-400">ثبت ساده پس از اتمام سهمیه رایگان اولیه</p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm">۱۸۰,۰۰۰ تومان</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 flex justify-between items-center shadow-md">
              <div>
                <h4 className="font-bold text-amber-300 text-xs">⭐ آگهی طلایی و اولویت‌دار (Featured Ad)</h4>
                <p className="text-[11px] text-slate-400">نمایش در صدر نتایج، ویترین اصلی و نشان ویژه طلایی</p>
              </div>
              <span className="font-mono font-black text-amber-400 text-base">۵۵۰,۰۰۰ تومان</span>
            </div>
          </div>
        </div>

        {/* 3. Advertising Service Pricing & Free Trial */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-amber-500/30 bg-slate-900/80">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-black text-amber-300 text-sm flex items-center gap-2">
              <i className="fa-solid fa-bullhorn text-amber-400"></i>
              <span>تعرفه خدمات تبلیغاتی و بنرها (مدل ترکیبی رایگان و پولی)</span>
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">بسیار معقول</span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-200 text-xs">فاز اول (تخفیف / رایگان اولیه)</h4>
                <p className="text-[11px] text-slate-400">۳ ماه نخست برای حمایت از تجار، کاملاً رایگان</p>
              </div>
              <span className="font-bold text-emerald-400 text-xs">۰ تومان (رایگان)</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-200 text-xs">بنر تبلیغاتی اسلایدر صفحه اول</h4>
                <p className="text-[11px] text-slate-400">نمایش بنر اختصاصی حجره در هدر (هفته‌ای)</p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-xs">۱,۵۰۰,۰۰۰ تومان</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/40 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-amber-300 text-xs">پکیج جامع طلایی تبلیغات ماهانه</h4>
                <p className="text-[11px] text-slate-400">شامل بنر اسلایدر + ۵ آگهی طلایی + نشان ویژه حجره</p>
              </div>
              <span className="font-mono font-black text-amber-400 text-sm">۳,۵۰۰,۰۰۰ تومان</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-center font-bold leading-relaxed">
        💡 تمامی تعرفه‌ها طوری طراحی شده‌اند که ضمن پوشش هزینه‌های زیرساخت، سرور و توسعه فنی پلتفرم، کاملاً برای تجار و بافندگان عزیز اقتصادی و مقرون‌به‌صرفه باشد.
      </div>
    </div>
  );
};
