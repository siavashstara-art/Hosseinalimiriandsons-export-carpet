import React, { useState } from 'react';
import { AppLang } from '../types';

interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  expiresAt: string;
}

const DEFAULT_BANNERS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'حجره ویژه صادرکنندگان ابریشم تبریز',
    subtitle: 'ارسال مستقیم به سراسر اروپا و خاورمیانه با ضمانت اصالت',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#booths',
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'ad-2',
    title: 'نمایشگاه بین‌المللی فرش دستباف تهران',
    subtitle: 'ثبت‌نام رایگان حجره‌داران صنف فرش در سراسر کشور',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#booths',
    isActive: true,
    expiresAt: '2026-12-31'
  }
];

interface AdminAdPanelProps {
  currentLang: AppLang;
}

export const AdminAdPanel: React.FC<AdminAdPanelProps> = ({ currentLang }) => {
  const [banners, setBanners] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem('alimiri_admin_ads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_BANNERS;
      }
    }
    return DEFAULT_BANNERS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newExpires, setNewExpires] = useState('2026-12-31');
  const [adminPass, setAdminPass] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const saveToStorage = (updated: AdBanner[]) => {
    setBanners(updated);
    localStorage.setItem('alimiri_admin_ads', JSON.stringify(updated));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1342' || adminPass === 'admin123' || adminPass === '0000') {
      setIsAdminAuthenticated(true);
    } else {
      alert('رمز عبور ادمین نادرست است. (پیش‌فرض: ۱۳۴۲ یا 0000)');
    }
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      alert('لطفاً عنوان و لینک تصویر بنر را وارد کنید.');
      return;
    }

    const created: AdBanner = {
      id: 'ad-' + Date.now(),
      title: newTitle,
      subtitle: newSubtitle || 'بنر تبلیغاتی صنف فرش',
      imageUrl: newImageUrl,
      linkUrl: newLinkUrl || '#',
      isActive: true,
      expiresAt: newExpires
    };

    saveToStorage([created, ...banners]);
    setNewTitle('');
    setNewSubtitle('');
    setNewImageUrl('');
    setNewLinkUrl('');
    alert('بنر جدید با موفقیت اضافه شد و در اسلایدر برنامه نمایش داده شد.');
  };

  const toggleActive = (id: string) => {
    const updated = banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    saveToStorage(updated);
  };

  const deleteAd = (id: string) => {
    if (confirm('آیا از حذف این بنر تبلیغاتی مطمئن هستید؟')) {
      const updated = banners.filter(b => b.id !== id);
      saveToStorage(updated);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="glass-card rounded-3xl p-8 max-w-md mx-auto space-y-6 text-center border border-amber-500/30 shadow-2xl mt-10">
        <div className="w-16 h-16 rounded-2xl gold-grad mx-auto flex items-center justify-center text-slate-950 text-2xl shadow-xl">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-amber-300">پنل مدیریت تبلیغات ادمین</h2>
          <p className="text-xs text-slate-300">
            لطفاً رمز عبور مدیریت پلتفرم بازار دیجیتال فرش را وارد کنید.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="رمز عبور ادمین (مثال: ۱۳۴۲)"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-grad text-slate-950 font-black text-sm shadow-lg hover:opacity-95 transition"
          >
            ورود به پنل مدیریت
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 border border-amber-500/30 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-bullhorn"></i>
            <span>Admin Ad Control Panel</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">مدیریت بنرهای تبلیغاتی بازار</h2>
          <p className="text-xs text-slate-300 mt-1">
            مدیریت، بارگذاری، فعال/غیرفعال‌سازی و تنظیم تاریخ انقضای بنرهای تجار و کارخانه‌ها
          </p>
        </div>
        <button
          onClick={() => setIsAdminAuthenticated(false)}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 transition"
        >
          خروج از ادمین
        </button>
      </div>

      {/* Add New Ad Form */}
      <form onSubmit={handleAddAd} className="bg-slate-900/90 rounded-2xl p-6 border border-amber-500/20 space-y-4 shadow-inner">
        <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-plus-circle text-amber-400"></i>
          <span>افزودن بنر تبلیغاتی جدید</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">عنوان بنر:</label>
            <input
              type="text"
              placeholder="مثال: حجره ویژه صادرکنندگان تبریز"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">توضیح کوتاه / شعار:</label>
            <input
              type="text"
              placeholder="مثال: ارسال مستقیم با ضمانت اصالت"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">لینک تصویر بنر (URL):</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">تاریخ انقضا:</label>
            <input
              type="date"
              value={newExpires}
              onChange={(e) => setNewExpires(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition"
        >
          ثبت و انتشار فوری بنر در اسلایدر برنامه
        </button>
      </form>

      {/* Existing Banners List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-list text-amber-400"></i>
          <span>لیست بنرهای فعال و آرشیو ({banners.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {banners.map((ad) => (
            <div
              key={ad.id}
              className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition ${
                ad.isActive
                  ? 'bg-slate-900/80 border-amber-500/40 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-24 h-16 object-cover rounded-xl border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{ad.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      ad.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ad.isActive ? 'فعال در اسلایدر' : 'غیرفعال'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{ad.subtitle}</p>
                  <p className="text-[10px] text-slate-400">تاریخ انقضا: {ad.expiresAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => toggleActive(ad.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    ad.isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ad.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                </button>
                <button
                  onClick={() => deleteAd(ad.id)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 transition"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
