export type AppLang = 'fa' | 'en' | 'ar';
export type TransTargetLang = 'en' | 'ar' | 'az' | 'ku' | 'fa';

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
  format: 'story' | 'post'; // story = 1080x1920, post = 1080x1080
  imageSrc: string | null;
}
