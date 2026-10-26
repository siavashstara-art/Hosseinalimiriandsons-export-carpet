export type AppLang = 'fa' | 'zh' | 'en' | 'ar' | 'de' | 'fr' | 'it' | 'ja';
export type TransTargetLang = 'en' | 'ar' | 'az' | 'ku' | 'fa' | 'zh' | 'de' | 'fr' | 'it' | 'ja';

export type CarpetCategory = 'handmade' | 'machine';

export interface MachineRugSpecs {
  reedCount: number;    // شانه (e.g. 700, 1200, 1500)
  density: number;      // تراکم (e.g. 2550, 3600, 4500)
  fiberType: string;    // e.g. 100% Acrylic Heat-set
  yarnOrigin: string;
}

export interface CarpetListing {
  id: string;
  title: string;
  category: CarpetCategory;
  priceTomanMillion: number;
  priceUSD: number;
  boothName: string;
  nationalIdMasked: string;
  isVerifiedMerchant: boolean;
  province?: string;
  city: string;
  image: string;
  description: string;
  raj?: number;
  warpMaterial?: string;
  machineSpecs?: MachineRugSpecs;
}

export interface BoothMerchant {
  id: string;
  merchantName: string;
  boothName: string;
  nationalId: string;
  phoneNumber: string;
  marketType: CarpetCategory;
  verified: boolean;
  reputationStars: number;
  adCount: number;
  adQuotaMax: number;
  province?: string;
  city: string;
  phone: string;
  joinDate: string;
}

export interface IranianProvince {
  id: string;
  nameFa: string;
  nameEn: string;
  capitalFa: string;
  famousCarpetTypeFa: string; // e.g., 'فرش ۶۰ رج تبریز', 'قالی صیرفیان', 'ابریشم قم'
  cities: string[];
  activeBoothsCount?: number;
  activeAdsCount?: number;
}


export interface UserProfile {
  userId: string;
  name: string;
  phone: string;
  email: string;
  profileId: string;
  nationalId?: string;
  referralCode: string;
  referredBy?: string;
  xpScore: number;
  starCount: number;
  metaverseLandSqm: number;
  metaverseLicenseStatus: 'official_licensed' | 'pending' | 'none';
  avatarUrl?: string;
  authProvider: 'mobile_otp' | 'google';
}

export interface ReferralMember {
  id: string;
  rank: number;
  name: string;
  boothName: string;
  successfulReferrals: number;
  xpScore: number;
  legendaryStarsReward: number;
  metaverseLandSqm: number;
  metaverseLicenseStatus: 'official_licensed' | 'pending';
  trustScore: number;
  city: string;
}

export interface ReportTicket {
  id: string;
  targetType: 'ad' | 'booth' | 'user';
  targetId: string;
  reasonCategory: 'fraud' | 'overpricing' | 'fake_handcraft' | 'stolen' | 'ethical';
  description: string;
  reporterContact: string;
  createdAt: string;
  status: 'pending' | 'banned' | 'union_referred';
}

export interface CustomOrderRequest {
  id: string;
  orderType: 'celebrity_portrait' | 'official_flag' | 'sports_club' | 'federation' | 'custom_art';
  title: string;
  dimensionsCm: string;
  material: 'pure_silk' | 'silk_wool_blend' | 'fine_wool';
  targetRaj: number;
  customerName: string;
  organizationName?: string;
  contactPhone: string;
  artworkImage?: string;
  notes: string;
  estimatedPriceUSD: number;
  estimatedDays: number;
  status: 'submitted' | 'design_approved' | 'on_loom' | 'completed';
  createdAt: string;
}

export interface AppraisalRequest {
  id: string;
  ownerName: string;
  contactPhone: string;
  carpetDimensions: string;
  frontImageBase64?: string;
  backImageBase64?: string;
  notes: string;
  status: 'pending_review' | 'analyzing' | 'certified' | 'rejected';
  createdAt: string;
}

export interface RugAnalysisResult {
  detectedSide?: 'back' | 'front' | 'detail';
  originRegion?: string;
  designStyle?: string;
  rajEstimate?: number;
  totalKnotDensitySqMeter?: number;
  warpWeftMaterial?: string;
  dyeType?: string;
  knotType?: string;
  estimatedValueUSD?: string;
  estimatedValueToman?: string;
  authenticityScore?: number;
  summaryTitle?: string;
  detailedAppraisal?: string;
  bazaarTips?: string[];
}

export interface GlossaryTerm {
  id: string;
  faTerm: string;
  enTerm: string;
  arTerm: string;
  phoneticFa: string;
  phoneticEn: string;
  category: 'trading' | 'weaving' | 'pattern' | 'quality';
  faDesc: string;
  enDesc: string;
  arDesc: string;
}

export interface StoryConfig {
  title: string;
  details: string;
  price: string;
  contact: string;
  theme: 'gold' | 'obsidian' | 'eslimi' | 'minimal';
  format: 'story' | 'post';
  imageSrc: string | null;
}

export interface MuseumRugItem {
  id: string;
  titleFa: string;
  titleEn: string;
  origin: string;
  raj: number;
  size: string;
  material: string;
  priceUSD: number;
  priceEUR: number;
  priceAED: number;
  priceJPY: number;
  priceTomanMillion: number;
  image: string;
  description: string;
}

export interface PublicHomeListing {
  id: string;
  title: string;
  category: 'handmade' | 'machine';
  condition: 'new' | 'like_new' | 'used' | 'needs_repair';
  dimensionsCm: string;
  material: string;
  description: string;
  priceTomanMillion: number;
  priceUSD: number;
  province: string;
  city: string;
  neighborhood: string;
  address: string;
  gpsLocation?: { lat: number; lng: number };
  sellerName: string;
  sellerPhone: string;
  nationalIdMasked: string;
  images: string[];
  isPromoted?: boolean;
  isPinned?: boolean;
  promotionType?: 'free' | 'excess_paid' | 'ladder' | 'pinned';
  createdAt: string;
}

