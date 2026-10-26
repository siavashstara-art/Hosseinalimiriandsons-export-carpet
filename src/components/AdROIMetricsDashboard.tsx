import React from 'react';
import { AppLang } from '../types';

interface AdTierStats {
  tier: string;
  impressions: number;
  clicks: number;
  conversions: number;
  salesRevenue: number; // Million Tomans
  cost: number; // Million Tomans
}

interface AdROIMetricsDashboardProps {
  currentLang: AppLang;
}

export const AdROIMetricsDashboard: React.FC<AdROIMetricsDashboardProps> = ({ currentLang }) => {
  // Simulated statistics for ad tiers
  const stats: AdTierStats[] = [
    { tier: 'عادی (Normal)', impressions: 1200, clicks: 45, conversions: 4, salesRevenue: 5.0, cost: 0.18 },
    { tier: 'طلایی (Golden)', impressions: 3500, clicks: 180, conversions: 15, salesRevenue: 25.0, cost: 0.55 },
    { tier: 'اولویت‌دار (Priority)', impressions: 6000, clicks: 450, conversions: 45, salesRevenue: 80.0, cost: 0.95 },
  ];

  const calculateCTR = (clicks: number, impressions: number) => ((clicks / impressions) * 100).toFixed(2);
  const calculateROI = (revenue: number, cost: number) => (((revenue - cost) / cost) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.tier} className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-amber-300 font-black text-sm">{stat.tier}</h4>
            <div className="flex justify-between text-xs text-slate-400">
              <span>CTR:</span>
              <span className="font-bold text-slate-200">{calculateCTR(stat.clicks, stat.impressions)}%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>ROI:</span>
              <span className={`font-bold ${Number(calculateROI(stat.salesRevenue, stat.cost)) > 500 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {calculateROI(stat.salesRevenue, stat.cost)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full" 
                style={{ width: `${Math.min(Number(calculateCTR(stat.clicks, stat.impressions)) * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-start text-xs text-slate-300">
          <thead className="bg-slate-900 text-amber-300">
            <tr>
              <th className="p-3">نوع آگهی</th>
              <th className="p-3">نمایش (Impression)</th>
              <th className="p-3">کلیک</th>
              <th className="p-3">فروش (M Tomans)</th>
              <th className="p-3">هزینه (M Tomans)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {stats.map((stat) => (
              <tr key={stat.tier}>
                <td className="p-3 font-bold text-white">{stat.tier}</td>
                <td className="p-3 font-mono">{stat.impressions.toLocaleString()}</td>
                <td className="p-3 font-mono">{stat.clicks.toLocaleString()}</td>
                <td className="p-3 font-mono text-emerald-400">{stat.salesRevenue}</td>
                <td className="p-3 font-mono text-rose-400">{stat.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
