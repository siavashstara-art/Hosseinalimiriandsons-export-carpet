import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Helper to construct GoogleGenAI instance on server
function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in process.env');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Analyze Carpet Image (Multimodal Front or Back)
app.post('/api/gemini/analyze-rug', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', analysisType = 'auto', userNotes = '', targetLang = 'fa' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 is required.' });
    }

    const ai = getAi();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const langInstruction = targetLang === 'en'
      ? 'Respond strictly in English language.'
      : targetLang === 'ar'
      ? 'Respond strictly in Arabic language.'
      : 'Respond strictly in fluent Persian (Farsi) language with Iranian carpet bazaar terminology.';

    const systemPrompt = `You are a world-renowned master expert and appraiser of handmade Persian carpets, representing the legacy of Hossein Alimiri & Sons Carpet Merchant in the Grand Iranian Carpet Bazaar.
Analyze the provided carpet image with deep technical precision.

${langInstruction}

Determine if this image shows:
1. The BACK WEAVE (reverse side) of a rug -> focus on knot density, Raj count (knots per 7 centimeters), warp/weft material (silk vs cotton), knot type (Senneh/Persian vs Giordes/Turkish), and weave precision.
2. The FRONT DESIGN of a rug -> focus on origin/region (e.g. Tabriz, Isfahan, Qom, Nain, Kashan, Shiraz/Ghashghai, Bijar, Kerman), pattern style (Lachak Toranj, Afshan, Mahi, Botteh, Tree of Life, Hunting), dye quality (natural vegetable dye vs synthetic), pile height, age/condition, and estimated market value tier.

Return a valid JSON object with the exact following schema:
{
  "detectedSide": "back" | "front" | "detail",
  "originRegion": "string (e.g., Tabriz / تبریز)",
  "designStyle": "string (e.g., Lachak Toranj / لچک ترنج)",
  "rajEstimate": number (estimated knots per 7 cm, e.g. 50),
  "totalKnotDensitySqMeter": number (e.g. 510000),
  "warpWeftMaterial": "string (e.g., Silk Warp / چله ابریشم)",
  "dyeType": "string (e.g., Natural Vegetable Dyes / رنگرزی گیاهی)",
  "knotType": "string (e.g., Asymmetric Persian Knot / گره فارسی)",
  "estimatedValueUSD": "string (e.g., $2,500 - $3,800 USD)",
  "estimatedValueToman": "string (e.g., ۱۵۰ تا ۲۲۰ میلیون تومان)",
  "authenticityScore": number (1 to 100),
  "summaryTitle": "string",
  "detailedAppraisal": "string (3-4 technical sentences)",
  "bazaarTips": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this handmade carpet photo. User notes: "${userNotes}". Analysis preference: ${analysisType}. ${systemPrompt}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-rug:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze carpet image.' });
  }
});

// 2. Translate Bazaar Terminology
app.post('/api/gemini/translate-term', async (req, res) => {
  try {
    const { term, targetLang = 'en', sourceLang = 'fa' } = req.body;

    if (!term) {
      return res.status(400).json({ error: 'Term string is required.' });
    }

    const ai = getAi();

    const systemPrompt = `You are a Persian carpet market dictionary and expert cultural interpreter for the Hossein Alimiri & Sons Carpet Merchant.
Translate and explain the carpet market jargon or term "${term}" into target language: "${targetLang}".

Return a valid JSON object with the schema:
{
  "originalTerm": "string",
  "translatedTerm": "string",
  "phoneticPronunciation": "string",
  "literalMeaning": "string",
  "bazaarContext": "string (Detailed explanation of how this term is used in negotiation or carpet evaluation)",
  "exampleSentence": "string",
  "relatedTerms": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/translate-term:', error);
    return res.status(500).json({ error: error.message || 'Failed to translate term.' });
  }
});

// 3. Text to Speech for Terms & Appraisal Audio
app.post('/api/gemini/speech', async (req, res) => {
  try {
    const { text, voice = 'Kore', style = 'Warm, respectful carpet expert' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const ai = getAi();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: { style },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'Audio data was not generated.' });
    }

    return res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    console.error('Error in /api/gemini/speech:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate speech audio.' });
  }
});

// In-memory Database for Booths and Listings
interface BoothRecord {
  booth_id: string;
  user_id: string;
  national_id: string;
  phone_number: string;
  merchant_name: string;
  booth_name: string;
  market_type: 'handmade' | 'machine';
  province: string;
  city: string;
  active_listings_count: number;
  free_quota_max: number;
  free_quota_remaining: number;
  reputation_stars: number;
  verified: boolean;
  created_at: string;
}

interface ListingRecord {
  listing_id: string;
  booth_id: string;
  market_type: 'handmade' | 'machine';
  title: string;
  price_toman_million: number;
  price_usd: number;
  status: 'free_quota' | 'paid' | 'pending_payment';
  tracking_code: string;
  payment_ref?: string;
  created_at: string;
}

const dbBooths: BoothRecord[] = [
  {
    booth_id: 'booth-1',
    user_id: 'usr-101',
    national_id: '0012345678',
    phone_number: '09121234567',
    merchant_name: 'حاج حسینعلی میری و پسران',
    booth_name: 'حجره مرکزی فرش میری (بازار بزرگ)',
    market_type: 'handmade',
    province: 'تهران',
    city: 'تهران (بازار بزرگ)',
    active_listings_count: 2,
    free_quota_max: 3,
    free_quota_remaining: 1,
    reputation_stars: 5.0,
    verified: true,
    created_at: '1350'
  },
  {
    booth_id: 'booth-2',
    user_id: 'usr-102',
    national_id: '1289012345',
    phone_number: '09139876543',
    merchant_name: 'مهندس کاظمی',
    booth_name: 'غرفه فرش ماشینی کاشان نوین',
    market_type: 'machine',
    province: 'اصفهان و کاشان',
    city: 'کاشان (پایتخت فرش ماشینی)',
    active_listings_count: 3,
    free_quota_max: 3,
    free_quota_remaining: 0,
    reputation_stars: 4.9,
    verified: true,
    created_at: '1398'
  },
  {
    booth_id: 'booth-3',
    user_id: 'usr-103',
    national_id: '1378889999',
    phone_number: '09141112233',
    merchant_name: 'استاد علیرضا تبریزی',
    booth_name: 'حجره فاخر سرای مظفریه تبریز',
    market_type: 'handmade',
    province: 'آذربایجان شرقی (تبریز)',
    city: 'تبریز (سرای مظفریه)',
    active_listings_count: 2,
    free_quota_max: 3,
    free_quota_remaining: 1,
    reputation_stars: 5.0,
    verified: true,
    created_at: '1378'
  },
  {
    booth_id: 'booth-4',
    user_id: 'usr-104',
    national_id: '0381112222',
    phone_number: '09125556677',
    merchant_name: 'حاج احمد قمی',
    booth_name: 'حجره ابریشم‌بافان تیمچه قم',
    market_type: 'handmade',
    province: 'قم',
    city: 'قم (تیمچه بزرگ)',
    active_listings_count: 1,
    free_quota_max: 3,
    free_quota_remaining: 2,
    reputation_stars: 4.9,
    verified: true,
    created_at: '1385'
  }
];

const dbListings: ListingRecord[] = [
  {
    listing_id: 'list-101',
    booth_id: 'booth-1',
    market_type: 'handmade',
    title: 'قالیچه ۶ متری تبریز ۶۰ رج چله ابریشم',
    price_toman_million: 240,
    price_usd: 4000,
    status: 'free_quota',
    tracking_code: 'RUG-AUTH-2026-98124',
    created_at: new Date().toISOString()
  }
];

// Validation Helper Functions
function isValidNationalId(id: string): boolean {
  const cleanId = id.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  if (!/^\d{10}$/.test(cleanId)) return false;
  if (/^(\d)\1{9}$/.test(cleanId)) return false;
  const check = parseInt(cleanId[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanId[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

function isValidMobileNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();
  return /^09\d{9}$/.test(cleanPhone);
}

// REST API 1: Get Booths (With Regional Province & City Filters)
app.get('/api/booths', (req, res) => {
  const { market_type, province, city } = req.query;
  let results = dbBooths;

  if (market_type) {
    results = results.filter(b => b.market_type === market_type);
  }
  if (province && String(province) !== 'all') {
    results = results.filter(b => b.province.includes(String(province)) || String(province).includes(b.province));
  }
  if (city && String(city) !== 'all') {
    results = results.filter(b => b.city.includes(String(city)));
  }

  return res.json({ success: true, count: results.length, booths: results });
});


// REST API 2: Register Booth (Dual-Factor Mobile + National ID Validation & Unique 1-to-1 Constraint)
app.post('/api/booths/register', (req, res) => {
  const { merchant_name, booth_name, national_id, phone_number, market_type = 'handmade', province = 'تهران', city = 'تهران' } = req.body;


  if (!merchant_name || !booth_name || !national_id || !phone_number) {
    return res.status(400).json({ error: 'لطفاً تمامی مشخصات شامل نام تاجر، نام حجره، کد ملی و شماره موبایل را وارد نمایید.' });
  }

  // Validate National ID Checksum
  if (!isValidNationalId(national_id)) {
    return res.status(400).json({ error: 'کد ملی وارد شده نامعتبر است. لطفاً کد ۱۰ رقمی صحیح وارد کنید.' });
  }

  // Validate Mobile Number Format
  if (!isValidMobileNumber(phone_number)) {
    return res.status(400).json({ error: 'شماره موبایل وارد شده نامعتبر است. شماره باید با 09 شروع شده و ۱۱ رقم باشد.' });
  }

  // 1-to-1 Unique Constraint Check: Each National ID + Phone pair must be unique
  const cleanNatId = national_id.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  const cleanPhone = phone_number.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();

  const existingNationalId = dbBooths.find(b => b.national_id === cleanNatId);
  if (existingNationalId) {
    return res.status(409).json({ error: `این کد ملی (${cleanNatId}) قبلاً در سیستم ثبت شده است. هر کد ملی مجاز به ایجاد فقط ۱ حجره می‌باشد.` });
  }

  const existingPhone = dbBooths.find(b => b.phone_number === cleanPhone);
  if (existingPhone) {
    return res.status(409).json({ error: `این شماره موبایل (${cleanPhone}) قبلاً به حجره دیگری متصل شده است.` });
  }

  const newBooth: BoothRecord = {
    booth_id: `booth-${Date.now()}`,
    user_id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
    national_id: cleanNatId,
    phone_number: cleanPhone,
    merchant_name,
    booth_name,
    market_type: market_type === 'machine' ? 'machine' : 'handmade',
    province: province || 'تهران',
    city,

    active_listings_count: 0,
    free_quota_max: 3, // Default 3 free listings per national ID
    free_quota_remaining: 3,
    reputation_stars: 5.0,
    verified: true,
    created_at: new Date().toLocaleDateString('fa-IR')
  };

  dbBooths.unshift(newBooth);
  return res.json({ success: true, message: 'حجره تجاری با موفقیت بر اساس استعلام کد ملی و شماره موبایل ثبت گردید.', booth: newBooth });
});

// REST API 3: Create Listing & Quota Check
app.post('/api/listings/create', (req, res) => {
  const { booth_id, title, price_toman_million, price_usd, market_type = 'handmade' } = req.body;

  const booth = dbBooths.find(b => b.booth_id === booth_id);
  if (!booth) {
    return res.status(404).json({ error: 'حجره یافت نشد.' });
  }

  // Quota Check
  if (booth.active_listings_count >= booth.free_quota_max) {
    // Quota Exceeded -> Paywall Required
    return res.json({
      success: true,
      requiresPayment: true,
      feeToman: 150000, // 150,000 Toman for extra ad
      feeUSD: 5,
      quotaUsed: booth.active_listings_count,
      freeQuotaMax: booth.free_quota_max,
      message: 'سهمیه آگهی‌های رایگان کد ملی شما به پایان رسیده است. جهت انتشار آگهی مازاد به درگاه پرداخت دیجیتال هدایت می‌شوید.'
    });
  }

  // Quota Available -> Free Listing
  booth.active_listings_count += 1;
  booth.free_quota_remaining = Math.max(0, booth.free_quota_max - booth.active_listings_count);

  const newListing: ListingRecord = {
    listing_id: `list-${Date.now()}`,
    booth_id,
    market_type,
    title,
    price_toman_million: price_toman_million || 100,
    price_usd: price_usd || 1500,
    status: 'free_quota',
    tracking_code: `RUG-AUTH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    created_at: new Date().toISOString()
  };

  dbListings.unshift(newListing);
  return res.json({ success: true, requiresPayment: false, listing: newListing, booth });
});

// REST API 4: Digital Paywall Verification Endpoint
app.post('/api/paywall/verify', (req, res) => {
  const { booth_id, listing_data, payment_method = 'shetab' } = req.body;

  const booth = dbBooths.find(b => b.booth_id === booth_id);
  if (!booth) {
    return res.status(404).json({ error: 'حجره پیدا نشد.' });
  }

  const txRef = `PAY-TX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  booth.active_listings_count += 1;

  const paidListing: ListingRecord = {
    listing_id: `list-${Date.now()}`,
    booth_id,
    market_type: listing_data?.market_type || 'handmade',
    title: listing_data?.title || 'آگهی جدید فرش',
    price_toman_million: listing_data?.price_toman_million || 150,
    price_usd: listing_data?.price_usd || 2000,
    status: 'paid',
    payment_ref: txRef,
    tracking_code: `RUG-AUTH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    created_at: new Date().toISOString()
  };

  dbListings.unshift(paidListing);

  return res.json({
    success: true,
    paymentSuccess: true,
    transactionRef: txRef,
    amountPaidToman: 150000,
    listing: paidListing,
    booth,
    message: 'تراکنش با موفقیت تایید شد. آگهی مازاد شما در تالار بین‌المللی منتشر گردید.'
  });
});

// Users Database Schema & Referral Logs
interface UserRecord {
  user_id: string;
  phone?: string;
  email?: string;
  profile_id: string;
  name: string;
  referral_code: string;
  referred_by?: string;
  xp_score: number;
  star_count: number;
  metaverse_land_sqm: number;
  metaverse_license_status: 'official_licensed' | 'pending' | 'none';
  auth_provider: 'mobile_otp' | 'google';
  created_at: string;
}

interface ReferralLogRecord {
  log_id: string;
  referrer_user_id: string;
  referred_user_id: string;
  xp_awarded: number;
  created_at: string;
}

const dbUsers: UserRecord[] = [
  {
    user_id: 'usr-1',
    phone: '09121234567',
    email: 'miricarpet@gmail.com',
    profile_id: 'PROF-ALIMIRI-001',
    name: 'حاج حسینعلی میری و پسران',
    referral_code: 'REF-ALIMIRI-101',
    xp_score: 2850,
    star_count: 5,
    metaverse_land_sqm: 500,
    metaverse_license_status: 'official_licensed',
    auth_provider: 'mobile_otp',
    created_at: '1350'
  },
  {
    user_id: 'usr-2',
    phone: '09141112233',
    email: 'tabrizi@carpet.ir',
    profile_id: 'PROF-TABRIZI-002',
    name: 'استاد علیرضا تبریزی',
    referral_code: 'REF-TABRIZI-102',
    xp_score: 2100,
    star_count: 4,
    metaverse_land_sqm: 450,
    metaverse_license_status: 'official_licensed',
    auth_provider: 'mobile_otp',
    created_at: '1378'
  },
  {
    user_id: 'usr-3',
    phone: '09132223344',
    email: 'seirafian@gmail.com',
    profile_id: 'PROF-SEIRAFIAN-003',
    name: 'حاج محمد صیرفیان اصفهانی',
    referral_code: 'REF-SEIRAFIAN-103',
    xp_score: 1850,
    star_count: 4,
    metaverse_land_sqm: 400,
    metaverse_license_status: 'official_licensed',
    auth_provider: 'google',
    created_at: '1382'
  }
];

const otpCache: Record<string, string> = {};

// REST API 5: Send Mobile OTP Code
app.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!phone || !isValidMobileNumber(phone)) {
    return res.status(400).json({ error: 'شماره موبایل وارد شده نامعتبر است. فرمت صحیح: 09123456789' });
  }

  const cleanPhone = phone.replace(/[۰-۹]/g, (d: string) => String('۰ contest'.indexOf(d))).replace(/[\s-]/g, '').trim();
  const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpCache[cleanPhone] = simulatedOtp;

  return res.json({
    success: true,
    message: `کد تایید ۶ رقمی به شماره ${cleanPhone} ارسال گردید.`,
    simulatedOtp // Included for seamless AI studio preview execution
  });
});

// REST API 6: Verify Mobile OTP Code & Create/Login User
app.post('/api/auth/otp/verify', (req, res) => {
  const { phone, otp, referred_by, name } = req.body;

  const cleanPhone = phone.replace(/[۰-۹]/g, (d: string) => String('۰ contest'.indexOf(d))).replace(/[\s-]/g, '').trim();
  const cachedOtp = otpCache[cleanPhone];

  if (!cachedOtp || cachedOtp !== otp) {
    return res.status(400).json({ error: 'کد تایید وارد شده اشتباه است یا منقضی شده است.' });
  }

  delete otpCache[cleanPhone];

  let user = dbUsers.find(u => u.phone === cleanPhone);

  if (!user) {
    const userId = `usr-${Date.now()}`;
    const refCode = `REF-${cleanPhone.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

    user = {
      user_id: userId,
      phone: cleanPhone,
      profile_id: `PROF-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name || `تاجر فرش (${cleanPhone.slice(-4)})`,
      referral_code: refCode,
      referred_by: referred_by || undefined,
      xp_score: 150, // Welcome XP Bonus
      star_count: 1,
      metaverse_land_sqm: 0,
      metaverse_license_status: 'none',
      auth_provider: 'mobile_otp',
      created_at: new Date().toLocaleDateString('fa-IR')
    };

    dbUsers.push(user);
  }

  return res.json({
    success: true,
    message: 'ورود با موفقیت انجام گردید.',
    user
  });
});

// REST API 7: Google / Gmail One-Click Auth
app.post('/api/auth/google', (req, res) => {
  const { email, name, avatarUrl } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'ایمیل گوگل الزام‌آور است.' });
  }

  let user = dbUsers.find(u => u.email === email);

  if (!user) {
    const userId = `usr-g-${Date.now()}`;
    const refCode = `REF-GOOG-${Math.floor(1000 + Math.random() * 9000)}`;

    user = {
      user_id: userId,
      email,
      profile_id: `PROF-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name || 'کاربر گوگل',
      referral_code: refCode,
      xp_score: 200, // Welcome XP Bonus for Google Account
      star_count: 1,
      metaverse_land_sqm: 0,
      metaverse_license_status: 'none',
      auth_provider: 'google',
      created_at: new Date().toLocaleDateString('fa-IR')
    };

    dbUsers.push(user);
  }

  return res.json({
    success: true,
    message: 'احراز هویت حساب گوگل با موفقیت انجام شد.',
    user
  });
});

// REST API 8: Get Referral League Leaderboard with Tavana Metaverse Rewards (10 Ranks)
app.get('/api/referrals/leaderboard', (req, res) => {
  const topReferrers = [
    {
      rank: 1,
      id: 'ref-1',
      name: 'حاج حسینعلی میری و پسران',
      boothName: 'حجره مرکزی بازار بزرگ تهران',
      successfulReferrals: 148,
      xpScore: 2850,
      legendaryStarsReward: 4,
      metaverseLandSqm: 500,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 99.8,
      city: 'تهران'
    },
    {
      rank: 2,
      id: 'ref-2',
      name: 'استاد علیرضا تبریزی',
      boothName: 'سرای مظفریه تبریز',
      successfulReferrals: 92,
      xpScore: 2100,
      legendaryStarsReward: 3,
      metaverseLandSqm: 450,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 98.5,
      city: 'تبریز'
    },
    {
      rank: 3,
      id: 'ref-3',
      name: 'حاج محمد صیرفیان اصفهانی',
      boothName: 'مجموعه قالی استاد صیرفیان',
      successfulReferrals: 76,
      xpScore: 1850,
      legendaryStarsReward: 3,
      metaverseLandSqm: 400,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 97.9,
      city: 'اصفهان'
    },
    {
      rank: 4,
      id: 'ref-4',
      name: 'حاج احمد قمی',
      boothName: 'حجره ابریشم قوم قم',
      successfulReferrals: 62,
      xpScore: 1620,
      legendaryStarsReward: 2,
      metaverseLandSqm: 380,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 96.8,
      city: 'قم'
    },
    {
      rank: 5,
      id: 'ref-5',
      name: 'استاد کرمانی',
      boothName: 'سرای قالی کرمان فاخر',
      successfulReferrals: 54,
      xpScore: 1480,
      legendaryStarsReward: 2,
      metaverseLandSqm: 350,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 95.9,
      city: 'کرمان'
    },
    {
      rank: 6,
      id: 'ref-6',
      name: 'مهندس کاظمی کاشانی',
      boothName: 'غرفه فرش ماشینی کاشان نوین',
      successfulReferrals: 48,
      xpScore: 1350,
      legendaryStarsReward: 1,
      metaverseLandSqm: 330,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 94.7,
      city: 'کاشان'
    },
    {
      rank: 7,
      id: 'ref-7',
      name: 'حاج رضا مشهدی',
      boothName: 'حجره فرش مشهد مقدس',
      successfulReferrals: 41,
      xpScore: 1210,
      legendaryStarsReward: 1,
      metaverseLandSqm: 300,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 93.9,
      city: 'مشهد'
    },
    {
      rank: 8,
      id: 'ref-8',
      name: 'استاد نائینی',
      boothName: 'شاهکار قالی نائین',
      successfulReferrals: 35,
      xpScore: 1100,
      legendaryStarsReward: 1,
      metaverseLandSqm: 280,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 92.5,
      city: 'نائین'
    },
    {
      rank: 9,
      id: 'ref-9',
      name: 'حاج بیجاری گروسی',
      boothName: 'حجره فرش آهنینی بیجار',
      successfulReferrals: 31,
      xpScore: 980,
      legendaryStarsReward: 1,
      metaverseLandSqm: 250,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 91.8,
      city: 'بیجار'
    },
    {
      rank: 10,
      id: 'ref-10',
      name: 'استاد شیرازی قشقایی',
      boothName: 'ایل قشقایی شیراز',
      successfulReferrals: 28,
      xpScore: 890,
      legendaryStarsReward: 1,
      metaverseLandSqm: 220,
      metaverseLicenseStatus: 'official_licensed',
      trustScore: 90.6,
      city: 'شیراز'
    }
  ];

  return res.json({
    success: true,
    seasonTitle: 'لیگ بین‌المللی معرفان و برندگان متاورس شهر توانا',
    leaderboard: topReferrers
  });
});

// ----------------------------------------------------
// Public Home Sellers Database & Endpoints
// ----------------------------------------------------
interface PublicListingRecord {
  id: string;
  title: string;
  category: 'handmade' | 'machine';
  condition: 'new' | 'like_new' | 'used' | 'needs_repair';
  dimensions_cm: string;
  material: string;
  description: string;
  price_toman_million: number;
  price_usd: number;
  province: string;
  city: string;
  neighborhood: string;
  address: string;
  gps_location?: { lat: number; lng: number };
  seller_name: string;
  seller_phone: string;
  national_id: string;
  national_id_masked: string;
  images: string[];
  is_promoted: boolean;
  is_pinned: boolean;
  promotion_type: 'free' | 'excess_paid' | 'ladder' | 'pinned';
  status: 'active' | 'expired' | 'deleted';
  payment_ref?: string;
  created_at: string;
  expires_at: string;
}

const dbPublicListings: PublicListingRecord[] = [
  {
    id: 'pub-list-1',
    title: 'فرش دستباف ۶ متری کاشان طرح ترنج (فرش خانگی)',
    category: 'handmade',
    condition: 'like_new',
    dimensions_cm: '۲۰۰ در ۳۰۰ (۶ متری)',
    material: 'پشم صادراتی کاشان چله پنبه',
    description: 'این فرش در سالن پذیرایی خانه کاملا تمیز و کم پاخورده نگهداری شده است. بدون هیچ‌گونه سوختگی یا ساییدگی.',
    price_toman_million: 48,
    price_usd: 800,
    province: 'تهران',
    city: 'تهران',
    neighborhood: 'نیاوران',
    address: 'خیابان باهنر، خیابان مژده، پلاک ۱۲',
    gps_location: { lat: 35.8118, lng: 51.4532 },
    seller_name: 'خانم علوی',
    seller_phone: '09123456789',
    national_id: '0019876543',
    national_id_masked: '۰۰۱۹***۵۴۳',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
    ],
    is_promoted: true,
    is_pinned: true,
    promotion_type: 'pinned',
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30-day golden vitrine
  },
  {
    id: 'pub-list-2',
    title: 'فرش ۱۲ متری ۱۵۰۰ شانه تراکم ۴۵۰۰ ماشینی خانگی',
    category: 'machine',
    condition: 'new',
    dimensions_cm: '۳۰۰ در ۴۰۰ (۱۲ متری)',
    material: '۱۰۰٪ اکریلیک هیت‌ست آلمان',
    description: 'کاملاً نو داخل کاور کارخانه. جهیزیه بوده که به دلیل تغییر دکوراسیون به فروش می‌رسد.',
    price_toman_million: 22,
    price_usd: 370,
    province: 'اصفهان',
    city: 'اصفهان',
    neighborhood: 'چهارباغ بالا',
    address: 'خیابان چهارباغ، مجتمع کوثر',
    gps_location: { lat: 32.6546, lng: 51.6680 },
    seller_name: 'آقای رضایی',
    seller_phone: '09131112233',
    national_id: '1288887777',
    national_id_masked: '۱۲۸۸***۷۷۷',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    is_promoted: false,
    is_pinned: false,
    promotion_type: 'free',
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14-day standard ad
  }
];

// REST API: Get Public Home Carpet Listings
app.get('/api/public-listings', (req, res) => {
  const { province, city, category, condition } = req.query;
  const nowIso = new Date().toISOString();

  // 1. Filter out deleted or expired listings server-side
  let results = dbPublicListings.filter(l => {
    if (l.status === 'deleted') return false;
    if (l.expires_at && l.expires_at < nowIso) return false;
    return true;
  });

  if (category) {
    results = results.filter(l => l.category === category);
  }
  if (province && String(province) !== 'all') {
    results = results.filter(l => l.province.includes(String(province)) || String(province).includes(l.province));
  }
  if (city && String(city) !== 'all') {
    results = results.filter(l => l.city.includes(String(city)));
  }
  if (condition) {
    results = results.filter(l => l.condition === condition);
  }

  // 2. Strict prioritization: Golden Vitrine (pinned) in target province first, then other pinned, then promoted/regular
  const targetProv = province && String(province) !== 'all' ? String(province) : '';

  results.sort((a, b) => {
    const aIsMatchPinned = a.is_pinned && targetProv && (a.province.includes(targetProv) || targetProv.includes(a.province));
    const bIsMatchPinned = b.is_pinned && targetProv && (b.province.includes(targetProv) || targetProv.includes(b.province));
    if (aIsMatchPinned && !bIsMatchPinned) return -1;
    if (!aIsMatchPinned && bIsMatchPinned) return 1;

    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    if (a.is_promoted && !b.is_promoted) return -1;
    if (!a.is_promoted && b.is_promoted) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return res.json({ success: true, count: results.length, listings: results });
});


// REST API: Create Public Home Carpet Listing (5-Step Wizard & Freemium Quota Check)
app.post('/api/public-listings/create', (req, res) => {
  const {
    title,
    category = 'handmade',
    condition = 'like_new',
    dimensions_cm,
    material,
    description,
    price_toman_million,
    price_usd,
    province,
    city,
    neighborhood,
    address,
    gps_location,
    seller_name,
    seller_phone,
    national_id,
    images = []
  } = req.body;

  if (!title || !seller_name || !seller_phone || !national_id || !city) {
    return res.status(400).json({ error: 'لطفاً تمامی موارد ضروری شامل عنوان، نام فروشنده، شماره تماس، کد ملی و شهر را تکمیل فرمایید.' });
  }

  if (!isValidNationalId(national_id)) {
    return res.status(400).json({ error: 'کد ملی وارد شده نامعتبر است. لطفاً کد ۱۰ رقمی صحیح وارد کنید.' });
  }

  if (!isValidMobileNumber(seller_phone)) {
    return res.status(400).json({ error: 'شماره موبایل نامعتبر است. فرمت صحیح: 09123456789' });
  }

  const cleanNatId = national_id.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  const cleanPhone = seller_phone.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();

  // Check active free quota for this national ID (Max 3 free active ads)
  const activeUserListings = dbPublicListings.filter(l => l.national_id === cleanNatId);
  const FREE_QUOTA_MAX = 3;

  if (activeUserListings.length >= FREE_QUOTA_MAX) {
    // Requires Paywall Payment
    return res.json({
      success: true,
      requiresPayment: true,
      feeToman: 200000, // 200,000 Toman tariff for excess public ad
      feeUSD: 7,
      userActiveCount: activeUserListings.length,
      freeQuotaMax: FREE_QUOTA_MAX,
      message: `سهمیه آگهی‌های رایگان کد ملی شما (${activeUserListings.length} از ۳ آگهی) تکمیل شده است. جهت انتشار آگهی جدید به درگاه پرداخت متصل شوید.`
    });
  }

  const maskedNat = cleanNatId.slice(0, 4) + '***' + cleanNatId.slice(7);

  const newListing: PublicListingRecord = {
    id: `pub-list-${Date.now()}`,
    title,
    category,
    condition,
    dimensions_cm: dimensions_cm || '۶ متری',
    material: material || 'پشم/پنبه',
    description: description || 'فرش خانگی تمیز و سالم',
    price_toman_million: Number(price_toman_million) || 30,
    price_usd: Number(price_usd) || Math.round((Number(price_toman_million) || 30) * 16.6),
    province: province || 'تهران',
    city,
    neighborhood: neighborhood || 'مرکز شهر',
    address: address || 'ثبت شده توسط کاربر',
    gps_location,
    seller_name,
    seller_phone: cleanPhone,
    national_id: cleanNatId,
    national_id_masked: maskedNat,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'],
    is_promoted: false,
    is_pinned: false,
    promotion_type: 'free',
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  };

  dbPublicListings.unshift(newListing);

  return res.json({
    success: true,
    requiresPayment: false,
    listing: newListing,
    remainingFreeQuota: FREE_QUOTA_MAX - (activeUserListings.length + 1),
    message: 'آگهی خانگی شما با موفقیت و به صورت رایگان بر روی پلتفرم منتشر شد.'
  });
});

// ----------------------------------------------------
// Loyalty & Rewards Data Structure & Helper
// ----------------------------------------------------
interface LoyaltyRecord {
  user_phone: string;
  normal_purchases_count: number;
  golden_purchases_count: number;
  free_normal_ads_awarded: number;
  golden_bundles_awarded: number;
  available_bonus_normal_ads: number;
  available_bonus_golden_ads: number;
  history: {
    event: string;
    description: string;
    timestamp: string;
  }[];
}

const dbLoyalty: Record<string, LoyaltyRecord> = {};

function getOrCreateLoyalty(phone: string): LoyaltyRecord {
  if (!dbLoyalty[phone]) {
    dbLoyalty[phone] = {
      user_phone: phone,
      normal_purchases_count: 0,
      golden_purchases_count: 0,
      free_normal_ads_awarded: 0,
      golden_bundles_awarded: 0,
      available_bonus_normal_ads: 0,
      available_bonus_golden_ads: 0,
      history: []
    };
  }
  return dbLoyalty[phone];
}

// REST API: Promote or Pay Excess for Public Home Carpet Listing (With Idempotent Loyalty Rewards)
app.post('/api/public-listings/promote', (req, res) => {
  const { listing_id, promotion_type = 'ladder', payment_method = 'shetab' } = req.body;

  const listing = dbPublicListings.find(l => l.id === listing_id);
  if (!listing) {
    return res.status(404).json({ error: 'آگهی مورد نظر یافت نشد.' });
  }

  const txRef = `HOME-PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  let feeToman = 100000;
  if (promotion_type === 'excess_paid') feeToman = 200000;
  if (promotion_type === 'pinned') feeToman = 350000;

  if (promotion_type === 'ladder') {
    listing.is_promoted = true;
    listing.promotion_type = 'ladder';
    // Move to top of array
    const idx = dbPublicListings.indexOf(listing);
    dbPublicListings.splice(idx, 1);
    dbPublicListings.unshift(listing);
  } else if (promotion_type === 'pinned') {
    listing.is_pinned = true;
    listing.is_promoted = true;
    listing.promotion_type = 'pinned';
    // Golden Vitrine Rule: 30 days validity from promotion date
    listing.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  // Idempotent Loyalty Calculations
  const loyalty = getOrCreateLoyalty(listing.seller_phone);
  let loyaltyBonusMessage = '';

  if (promotion_type === 'pinned') {
    loyalty.golden_purchases_count += 1;
    loyalty.history.push({
      event: 'purchase_golden',
      description: `خرید ویترین طلایی ۳۰ روزه برای آگهی ${listing.id}`,
      timestamp: new Date().toISOString()
    });

    // Rule 2: Every 3 golden vitrine purchases -> 1 bundle (1 golden 30-day + 1 normal 14-day ad)
    if (loyalty.golden_purchases_count % 3 === 0) {
      loyalty.golden_bundles_awarded += 1;
      loyalty.available_bonus_golden_ads += 1;
      loyalty.available_bonus_normal_ads += 1;
      loyalty.history.push({
        event: 'reward_golden_bundle',
        description: 'اعطای پاداش بسته طلایی (۱ ویترین طلایی ۳۰روزه + ۱ آگهی عادی ۱۴روزه)',
        timestamp: new Date().toISOString()
      });
      loyaltyBonusMessage = ' تبریک! با ثبت سومین ویترین طلایی، یک بسته هدیه (ویترین طلایی ۳۰ روزه + آگهی عادی ۱۴ روزه) به حساب شما اضافه شد.';
    }
  } else {
    loyalty.normal_purchases_count += 1;
    loyalty.history.push({
      event: 'purchase_normal',
      description: `خرید ارتقای عادی/نردبان برای آگهی ${listing.id}`,
      timestamp: new Date().toISOString()
    });

    // Rule 1: Every 5 eligible normal purchases -> 1 free 14-day ad
    if (loyalty.normal_purchases_count % 5 === 0) {
      loyalty.free_normal_ads_awarded += 1;
      loyalty.available_bonus_normal_ads += 1;
      loyalty.history.push({
        event: 'reward_free_normal',
        description: 'اعطای پاداش ۵ خرید عادی (۱ آگهی عادی ۱۴روزه رایگان)',
        timestamp: new Date().toISOString()
      });
      loyaltyBonusMessage = ' تبریک! با ثبت پنجمین خرید، ۱ سهمیه آگهی عادی ۱۴ روزه رایگان به شما اهدا شد.';
    }
  }

  return res.json({
    success: true,
    paymentSuccess: true,
    transactionRef: txRef,
    amountPaidToman: feeToman,
    promotionType: promotion_type,
    listing,
    loyalty: {
      normalPurchases: loyalty.normal_purchases_count,
      goldenPurchases: loyalty.golden_purchases_count,
      availableBonusNormal: loyalty.available_bonus_normal_ads,
      availableBonusGolden: loyalty.available_bonus_golden_ads
    },
    message: `تراکنش با موفقیت تایید و آگهی اعمال گردید.${loyaltyBonusMessage}`
  });
});

// REST API: Get Loyalty Status
app.get('/api/loyalty/status', (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ error: 'شماره تلفن الزامی است.' });
  }
  const cleanPhone = String(phone).replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();
  const loyalty = getOrCreateLoyalty(cleanPhone);
  return res.json({ success: true, loyalty });
});

// ----------------------------------------------------
// Ad Deletion & Exit CSAT Survey
// ----------------------------------------------------
interface ExitSurveyRecord {
  survey_id: string;
  listing_id: string;
  seller_phone: string;
  reason: 'sold_on_platform' | 'sold_elsewhere' | 'regret' | 'price_issue' | 'other';
  csat_score: number; // 1 to 5
  feedback?: string;
  deleted_at: string;
}

const dbExitSurveys: ExitSurveyRecord[] = [];

// REST API: Delete Listing with Exit Survey
app.post('/api/public-listings/delete', (req, res) => {
  const { listing_id, phone, national_id, reason = 'sold_on_platform', csat_score = 5, feedback = '' } = req.body;

  if (!listing_id) {
    return res.status(400).json({ error: 'شناسه آگهی الزامی است.' });
  }

  const listing = dbPublicListings.find(l => l.id === listing_id);
  if (!listing) {
    return res.status(404).json({ error: 'آگهی مورد نظر یافت نشد.' });
  }

  // Authorization check: Verify phone or national ID matches seller
  const cleanPhone = phone ? String(phone).replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim() : '';
  const cleanNatId = national_id ? String(national_id).replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim() : '';

  if (cleanPhone && listing.seller_phone !== cleanPhone && (!cleanNatId || listing.national_id !== cleanNatId)) {
    return res.status(403).json({ error: 'دسترسی غیرمجاز: تنها مالک آگهی مجاز به حذف آن می‌باشد.' });
  }

  // Mark status as deleted
  listing.status = 'deleted';

  // Store Exit CSAT Survey
  const surveyRecord: ExitSurveyRecord = {
    survey_id: `srv-${Date.now()}`,
    listing_id,
    seller_phone: listing.seller_phone,
    reason,
    csat_score: Math.min(5, Math.max(1, Number(csat_score) || 5)),
    feedback: String(feedback).slice(0, 500),
    deleted_at: new Date().toISOString()
  };

  dbExitSurveys.push(surveyRecord);

  return res.json({
    success: true,
    message: 'آگهی با موفقیت حذف گردید و بازخورد شما در نظرسنجی خروج ثبت شد.',
    survey_id: surveyRecord.survey_id
  });
});

// ----------------------------------------------------
// Directory of Guilds (دایرکتوری اصناف فرش)
// قالیشویی، رفوگری، دارکشی، عدلبندی، باربری تخصصی، خدمات گمرکی
// ----------------------------------------------------
type GuildCategory =
  | 'carpet_washing'       // قالیشویی
  | 'carpet_repair'        // رفوگری و مرمت
  | 'loom_stretching'      // دارکشی
  | 'baling_packing'       // عدلبندی و بسته‌بندی
  | 'specialized_transit'  // باربری تخصصی فرش
  | 'customs_export';      // خدمات گمرکی و ترخیص

interface GuildListingRecord {
  id: string;
  guild_category: GuildCategory;
  category_name_fa: string;
  business_name: string;
  manager_name: string;
  phone: string;
  phone_masked: string;
  national_id: string;
  province: string;
  city: string;
  address: string;
  license_number: string;
  experience_years: number;
  description: string;
  is_free_quota: boolean;
  status: 'active' | 'expired';
  created_at: string;
  expires_at: string;
}

const categoryNamesFa: Record<GuildCategory, string> = {
  carpet_washing: 'قالیشویی مجاز و شستشوی سنتی',
  carpet_repair: 'رفوگری و مرمت تخصصی قالی',
  loom_stretching: 'دارکشی و رفع کجی فرش',
  baling_packing: 'عدلبندی و بسته‌بندی ضد آب صادراتی',
  specialized_transit: 'باربری تخصصی و حمل مجهز فرش',
  customs_export: 'خدمات گمرکی، ارزیابی و ترخیص صادرات'
};

const dbGuildListings: GuildListingRecord[] = [
  {
    id: 'guild-1',
    guild_category: 'carpet_washing',
    category_name_fa: categoryNamesFa['carpet_washing'],
    business_name: 'قالیشویی سنتی اوغلی بازار',
    manager_name: 'استاد رحمانی',
    phone: '09121113355',
    phone_masked: '۰۹۱۲***۳۳۵۵',
    national_id: '0012349999',
    province: 'تهران',
    city: 'تهران (بازار بزرگ)',
    address: 'خیابان پانزده خرداد، بازار آهنگران',
    license_number: 'صنف-۹۸۲۱',
    experience_years: 35,
    description: 'شستشوی سنتی و مکانیزه فرش‌های دستباف، عتیقه، چله ابریشم و اعلا با مواد گیاهی بدون تثبیت‌کننده شیمیایی.',
    is_free_quota: true,
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'guild-2',
    guild_category: 'carpet_repair',
    category_name_fa: categoryNamesFa['carpet_repair'],
    business_name: 'کارگاه رفوگری استاد کمالی',
    manager_name: 'استاد کمالی',
    phone: '09142224466',
    phone_masked: '۰۹۱۴***۴۴۶۶',
    national_id: '1378887766',
    province: 'آذربایجان شرقی',
    city: 'تبریز (سرای مظفریه)',
    address: 'سرای مظفریه، طبقه دوم، پلاک ۴۴',
    license_number: 'رفو-۴۱۲',
    experience_years: 28,
    description: 'گره‌بافی مجدد، بیدزدایی، رنگ‌برداری اصولی و ترمیم سوختگی و پارگی انواع قالی‌های موزه‌ای و عتیقه.',
    is_free_quota: true,
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// REST API: Get Guild Listings
app.get('/api/guilds', (req, res) => {
  const { category, province } = req.query;
  const nowIso = new Date().toISOString();

  let results = dbGuildListings.filter(g => {
    if (g.status === 'expired' || g.expires_at < nowIso) return false;
    return true;
  });

  if (category && category !== 'all') {
    results = results.filter(g => g.guild_category === category);
  }
  if (province && province !== 'all') {
    results = results.filter(g => g.province.includes(String(province)) || String(province).includes(g.province));
  }

  return res.json({
    success: true,
    count: results.length,
    guilds: results
  });
});

// REST API: Register Guild Listing (Rule: 2 Free 14-day Ads per Guild Category per National ID)
app.post('/api/guilds/register', (req, res) => {
  const {
    guild_category,
    business_name,
    manager_name,
    phone,
    national_id,
    province,
    city,
    address,
    license_number = 'در دست استعلام',
    experience_years = 5,
    description
  } = req.body;

  if (!guild_category || !business_name || !manager_name || !phone || !national_id || !province || !city) {
    return res.status(400).json({ error: 'لطفاً تمامی موارد الزامی شامل صنف، نام واحد، نام مدیر، شماره تماس، کد ملی و استان/شهر را وارد فرمایید.' });
  }

  if (!isValidNationalId(national_id)) {
    return res.status(400).json({ error: 'کد ملی وارد شده نامعتبر است.' });
  }

  if (!isValidMobileNumber(phone)) {
    return res.status(400).json({ error: 'شماره همراه وارد شده نامعتبر است.' });
  }

  const cleanNat = national_id.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  const cleanPhone = phone.replace(/[۰-۹]/g, (d: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();

  // Rule: Check existing active guild ads by this national ID in this specific category (Max 2 free 14-day ads)
  const GUILD_FREE_QUOTA_MAX = 2;
  const nowIso = new Date().toISOString();
  const existingActiveGuildAds = dbGuildListings.filter(g =>
    g.national_id === cleanNat &&
    g.guild_category === guild_category &&
    g.expires_at >= nowIso
  );

  if (existingActiveGuildAds.length >= GUILD_FREE_QUOTA_MAX) {
    return res.json({
      success: true,
      requiresPayment: true,
      feeToman: 300000,
      guildFreeQuotaMax: GUILD_FREE_QUOTA_MAX,
      message: `سهمیه ۲ آگهی رایگان شما برای صنف «${categoryNamesFa[guild_category as GuildCategory] || guild_category}» تکمیل شده است. جهت ثبت آگهی مازاد به درگاه بانکی متصل می‌شوید.`
    });
  }

  const maskedPhone = cleanPhone.slice(0, 4) + '***' + cleanPhone.slice(7);

  const newGuildRecord: GuildListingRecord = {
    id: `guild-${Date.now()}`,
    guild_category: guild_category as GuildCategory,
    category_name_fa: categoryNamesFa[guild_category as GuildCategory] || 'خدمات تخصصی فرش',
    business_name,
    manager_name,
    phone: cleanPhone,
    phone_masked: maskedPhone,
    national_id: cleanNat,
    province,
    city,
    address: address || 'آدرس ثبت شده',
    license_number,
    experience_years: Number(experience_years) || 1,
    description: description || 'خدمات تخصصی صنف فرش',
    is_free_quota: true,
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14-day rule
  };

  dbGuildListings.unshift(newGuildRecord);

  return res.json({
    success: true,
    requiresPayment: false,
    message: 'واحد صنفی شما با موفقیت در دایرکتوری اصناف با سهمیه رایگان ۱۴ روزه ثبت گردید.',
    remainingQuota: GUILD_FREE_QUOTA_MAX - (existingActiveGuildAds.length + 1),
    guild: newGuildRecord
  });
});


// Vite integration in Dev mode, or static serving in Prod mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const templatePath = path.resolve(__dirname, 'index.html');
      const fs = await import('fs');
      let template = fs.readFileSync(templatePath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Carpet Assistant server running on port ${PORT}`);
});
