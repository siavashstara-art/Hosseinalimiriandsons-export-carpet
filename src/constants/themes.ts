import { AppLang } from '../types';

export interface CulturalThemeConfig {
  id: AppLang;
  nameEn: string;
  nameLocal: string;
  flag: string;
  primaryColor: string;
  accentGlow: string;
  bgGradient: string;
  glassBorder: string;
  badgeStyle: string;
  tagline: string;
  culturalGreeting: string;
  tributeHighlight: string;
}

export const CULTURAL_THEMES: Record<AppLang, CulturalThemeConfig> = {
  fa: {
    id: 'fa',
    nameEn: 'Persian / Dari',
    nameLocal: 'فارسی / دری',
    flag: '🇮🇷',
    primaryColor: '#b91c1c',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    bgGradient: 'linear-gradient(135deg, #090d18 0%, #040711 50%, #0d1b2a 100%)',
    glassBorder: '1px solid rgba(245, 158, 11, 0.35)',
    badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    tagline: 'شکوه هنر اصیل ایرانی - لعل، فیروزه و طلا',
    culturalGreeting: 'بازار دیجیتال فرش ایران و جهان',
    tributeHighlight: '(ارائه‌ای از فرش حسین علی میری و پسران) | اثر آقای اکبر علیمیری'
  },
  zh: {
    id: 'zh',
    nameEn: 'Chinese',
    nameLocal: '中文 (简体)',
    flag: '🇨🇳',
    primaryColor: '#dc2626',
    accentGlow: 'rgba(250, 204, 21, 0.3)',
    bgGradient: 'linear-gradient(135deg, #1f0404 0%, #0c0202 50%, #2b0808 100%)',
    glassBorder: '1px solid rgba(250, 204, 21, 0.4)',
    badgeStyle: 'bg-red-900/40 text-yellow-300 border-yellow-500/50',
    tagline: '帝王深红与纯金 — 东方繁荣与至尊波斯地毯艺术',
    culturalGreeting: 'Iran & Global Digital Carpet Market',
    tributeHighlight: '(Presented by Hossein Ali Miri & Sons) | Created by Mr. Akbar Alimiri'
  },
  en: {
    id: 'en',
    nameEn: 'English',
    nameLocal: 'English (US/UK)',
    flag: '🇺🇸',
    primaryColor: '#1e3a8a',
    accentGlow: 'rgba(59, 130, 246, 0.25)',
    bgGradient: 'linear-gradient(135deg, #030a1c 0%, #020617 50%, #0f172a 100%)',
    glassBorder: '1px solid rgba(148, 163, 184, 0.35)',
    badgeStyle: 'bg-blue-900/40 text-blue-200 border-blue-400/40',
    tagline: 'Classic Navy Prestige & Sterling Silver — Global Fine Rug Portal',
    culturalGreeting: 'Iran & Global Digital Carpet Market',
    tributeHighlight: '(Presented by Hossein Ali Miri & Sons) | Created by Mr. Akbar Alimiri'
  },
  ar: {
    id: 'ar',
    nameEn: 'Arabic',
    nameLocal: 'العربية',
    flag: '🇸🇦',
    primaryColor: '#047857',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    bgGradient: 'linear-gradient(135deg, #021a12 0%, #020a07 50%, #064e3b 100%)',
    glassBorder: '1px solid rgba(251, 191, 36, 0.4)',
    badgeStyle: 'bg-emerald-900/40 text-emerald-200 border-emerald-500/40',
    tagline: 'الزمرد الأخضر والذهب الساطع — سوق السجاد الرقمي للإيران والعالم',
    culturalGreeting: 'سوق السجاد الرقمي للإيران والعالم',
    tributeHighlight: '(تقدمة سجاد حسين علي ميري وأولاده) | مبتكر المنصة السيد أكبر عليميري'
  },
  de: {
    id: 'de',
    nameEn: 'German',
    nameLocal: 'Deutsch',
    flag: '🇩🇪',
    primaryColor: '#18181b',
    accentGlow: 'rgba(217, 119, 6, 0.25)',
    bgGradient: 'linear-gradient(135deg, #121215 0%, #09090b 50%, #1c1917 100%)',
    glassBorder: '1px solid rgba(217, 119, 6, 0.35)',
    badgeStyle: 'bg-zinc-800 text-amber-300 border-amber-600/40',
    tagline: 'Holz, Charcoal & Matte Gold — Hamburger Präzision',
    culturalGreeting: 'Iran & Global Digital Carpet Market',
    tributeHighlight: '(Presented by Hossein Ali Miri & Sons) | Entwickelt von Hr. Akbar Alimiri'
  },
  fr: {
    id: 'fr',
    nameEn: 'French',
    nameLocal: 'Français',
    flag: '🇫🇷',
    primaryColor: '#1d4ed8',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    bgGradient: 'linear-gradient(135deg, #050c24 0%, #020617 50%, #1e1b4b 100%)',
    glassBorder: '1px solid rgba(199, 210, 254, 0.35)',
    badgeStyle: 'bg-indigo-950/60 text-indigo-200 border-indigo-400/40',
    tagline: 'Bleu Royal & Nacre Pur — Haute Couture',
    culturalGreeting: 'Iran & Global Digital Carpet Market',
    tributeHighlight: '(Présenté par Hossein Ali Miri & Sons) | Réalisé par M. Akbar Alimiri'
  },
  it: {
    id: 'it',
    nameEn: 'Italian',
    nameLocal: 'Italiano',
    flag: '🇮🇹',
    primaryColor: '#3f6212',
    accentGlow: 'rgba(132, 204, 22, 0.25)',
    bgGradient: 'linear-gradient(135deg, #121808 0%, #080c04 50%, #1c1917 100%)',
    glassBorder: '1px solid rgba(234, 179, 8, 0.4)',
    badgeStyle: 'bg-lime-950/60 text-lime-200 border-lime-500/40',
    tagline: 'Verde Ulivo Rinascimentale & Cremisi',
    culturalGreeting: 'Iran & Global Digital Carpet Market',
    tributeHighlight: '(Presentato da Hossein Ali Miri & Sons) | Creato da Akbar Alimiri'
  },
  ja: {
    id: 'ja',
    nameEn: 'Japanese',
    nameLocal: '日本語',
    flag: '🇯🇵',
    primaryColor: '#e11d48',
    accentGlow: 'rgba(225, 29, 72, 0.25)',
    bgGradient: 'linear-gradient(135deg, #1c050a 0%, #0a0204 50%, #18080c 100%)',
    glassBorder: '1px solid rgba(244, 63, 94, 0.35)',
    badgeStyle: 'bg-rose-950/60 text-rose-200 border-rose-500/40',
    tagline: '絹の白と日章の紅 — 禅の美学',
    culturalGreeting: 'イランおよび世界デジタルじゅうたん市場',
    tributeHighlight: '（ホセイン・アリ・ミリ父子手織り絨毯提供） | アクバル・アリミリ氏制作'
  }
};
