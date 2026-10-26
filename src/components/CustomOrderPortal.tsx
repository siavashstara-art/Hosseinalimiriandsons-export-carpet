import React, { useState } from 'react';
import { AppLang, CustomOrderRequest } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';

interface CustomOrderPortalProps {
  currentLang: AppLang;
}

export const MOCK_CUSTOM_ORDERS: CustomOrderRequest[] = [
  {
    id: 'ORD-901',
    orderType: 'sports_club',
    title: 'تابلوفرش چهره و نشان رسمی فدراسیون فوتبال',
    dimensionsCm: '۷۰ × ۱۰۰ سانتیمتر',
    material: 'pure_silk',
    targetRaj: 70,
    customerName: 'روابط عمومی فدراسیون',
    organizationName: 'فدراسیون فوتبال / باشگاه ورزشی',
    contactPhone: '۰۲۱-۸۸۷۷۶۶۵۵',
    notes: 'بافت ۱۰۰٪ ابریشم خالص با قاب خاتم‌کاری جهت اهداء در رویداد بین‌المللی',
    estimatedPriceUSD: 1800,
    estimatedDays: 45,
    status: 'on_loom',
    createdAt: '۱۴۰۵/۰۷/۱۵'
  },
  {
    id: 'ORD-902',
    orderType: 'official_flag',
    title: 'تابلوفرش ابریشمی پرچم رسمی جمهوری اسلامی ایران',
    dimensionsCm: '۱۰۰ × ۱۵۰ سانتیمتر',
    material: 'pure_silk',
    targetRaj: 65,
    customerName: 'تشریفات بین‌المللی',
    organizationName: 'نهاد تشریفات',
    contactPhone: '۰۲۱-۶۶۵۵۴۴۳۳',
    notes: 'پرچم رسمی با ابریشم درخشان طلاکوب جهت اهداء به سفارتخانه‌ها',
    estimatedPriceUSD: 2400,
    estimatedDays: 60,
    status: 'design_approved',
    createdAt: '۱۴۰۵/۰۷/۲۰'
  }
];

export const CustomOrderPortal: React.FC<CustomOrderPortalProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [orders, setOrders] = useState<CustomOrderRequest[]>(MOCK_CUSTOM_ORDERS);

  // Form State
  const [orderType, setOrderType] = useState<CustomOrderRequest['orderType']>('celebrity_portrait');
  const [title, setTitle] = useState<string>('');
  const [dimensionsCm, setDimensionsCm] = useState<string>('70x100');
  const [material, setMaterial] = useState<CustomOrderRequest['material']>('pure_silk');
  const [targetRaj, setTargetRaj] = useState<number>(70);
  const [customerName, setCustomerName] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [artworkImage, setArtworkImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setArtworkImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName || !contactPhone) {
      alert('لطفاً عنوان سفارش، نام متقاضی و شماره تماس را وارد کنید.');
      return;
    }

    // Estimate price: pure silk = $1800+, blend = $1100+
    const basePrice = material === 'pure_silk' ? 1800 : material === 'silk_wool_blend' ? 1200 : 800;
    const estDays = targetRaj >= 70 ? 60 : 40;

    const newOrder: CustomOrderRequest = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      orderType,
      title,
      dimensionsCm,
      material,
      targetRaj,
      customerName,
      organizationName,
      contactPhone,
      artworkImage: artworkImage || heroRugImg,
      notes,
      estimatedPriceUSD: basePrice,
      estimatedDays: estDays,
      status: 'submitted',
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    setOrders([newOrder, ...orders]);
    setTitle('');
    setNotes('');
    setArtworkImage(null);
    alert('🎉 سفارش اختصاصی بافت شما با موفقیت ثبت شد! کارشناسان تشریفات با شما تماس خواهند گرفت.');
  };

  const getStatusBadge = (status: CustomOrderRequest['status']) => {
    switch (status) {
      case 'completed': return { label: '✅ بافت تکمیل و تحویل داده شد', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'on_loom': return { label: '🧵 روی دار بافت (در حال اجرا)', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'design_approved': return { label: '📐 طرح و نقشه تایید شد', style: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      default: return { label: '⏳ ثبت اولیه و در حال بررسی', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-amber-500/30 pb-4">
        <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
          <i className="fa-solid fa-paintbrush text-amber-400"></i>
          <span>درگاه اختصاصی بافت سفارشات ویژه (مشاهیر، پرچم‌های رسمی، فدراسیون‌ها و باشگاه‌ها)</span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          بافت انحصاری تابلوفرش چهره مشاهیر، پرچم رسمی کشورها و هدایای تشریفاتی با ابریشم خالص
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Order Form */}
        <form onSubmit={handleOrderSubmit} className="space-y-3.5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="font-bold text-amber-300 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            <span>ثبت سفارش انحصاری بافت:</span>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">نوع سفارش ویژه:</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 font-bold focus:border-amber-500 focus:outline-none"
            >
              <option value="celebrity_portrait">🖼️ تابلوفرش چهره مشاهیر و شخصت‌ها</option>
              <option value="official_flag">🚩 پرچم‌های رسمی کشورها و سازمان‌ها</option>
              <option value="sports_club">⚽ باشگاه‌های ورزشی و فدراسیون‌ها</option>
              <option value="federation">🏛️ سازمان‌ها و نهادهای بین‌المللی</option>
              <option value="custom_art">🎨 نقاشی و آثار هنری سفارشی</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">عنوان سفارش / نام چهره یا نهاد:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: چهره استاد فرش یا نشان رسمی باشگاه"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300 font-bold">ابعاد پیشنهادی:</label>
              <select
                value={dimensionsCm}
                onChange={(e) => setDimensionsCm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="50x70">۵۰ × ۷۰ سانتیمتر</option>
                <option value="70x100">۷۰ × ۱۰۰ سانتیمتر</option>
                <option value="100x150">۱۰۰ × ۱۵۰ سانتیمتر</option>
                <option value="custom">ابعاد خاص سفارشی</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-bold">جنس تار و پرز:</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="pure_silk">💎 ۱۰۰٪ ابریشم خالص قم/تبریز</option>
                <option value="silk_wool_blend">✨ ابریشم و کرک اعلی</option>
                <option value="fine_wool">🧶 پشم و چله پنبه</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">بارگذاری عکس/طرح اولیه (در صورت وجود):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 file:bg-amber-500 file:text-slate-950 file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300 font-bold">نام متقاضی / سفارش دهنده:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="نام شما یا نماینده"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-bold">شماره تماس مستقیم:</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">توضیحات و جزئیات سفارش:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیحات قاب، رنگرزی یا تاریخ تحویل رویداد..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition"
          >
            ثبت سفارش بافت و دریافت پیش‌فاکتور تشریفات
          </button>
        </form>

        {/* Existing Custom Orders Tracker */}
        <div className="space-y-4">
          <div className="font-bold text-amber-300 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-list-check text-amber-400"></i>
            <span>پیگیری سفارشات ویژه در حال بافت:</span>
          </div>

          <div className="grid gap-3">
            {orders.map((ord) => {
              const st = getStatusBadge(ord.status);

              return (
                <div key={ord.id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 bg-slate-900/80">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-amber-400 font-bold text-[10px] me-2">{ord.id}</span>
                      <strong className="text-amber-200 font-bold text-xs">{ord.title}</strong>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${st.style}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    متقاضی: <strong className="text-slate-100 me-2">{ord.customerName}</strong> | ابعاد: <strong className="text-amber-300">{ord.dimensionsCm}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div>برآورد هزینه: <strong className="text-emerald-400 font-mono">${ord.estimatedPriceUSD} USD</strong></div>
                    <div>زمان تقریبی بافت: <strong className="text-amber-300 font-mono">{ord.estimatedDays} روز</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
