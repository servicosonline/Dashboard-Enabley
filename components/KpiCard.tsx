
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const KpiCard: React.FC<Props> = ({ title, value, icon: Icon, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
    yellow: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
    green: 'border-green-500/30 text-green-400 bg-green-500/5',
    teal: 'border-teal-500/30 text-teal-400 bg-teal-500/5',
    red: 'border-red-500/30 text-red-400 bg-red-500/5',
    indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
    pink: 'border-pink-500/30 text-pink-400 bg-pink-500/5',
    sky: 'border-sky-500/30 text-sky-400 bg-sky-500/5',
  };

  return (
    <div className={`glass-card p-4 rounded-2xl border text-center transition-transform hover:scale-105 duration-200 ${colorMap[color] || 'border-slate-500/30 text-slate-400'}`}>
      <div className="flex justify-center mb-2">
        <Icon className="w-5 h-5 opacity-60" />
      </div>
      <span className="text-2xl md:text-3xl font-bold text-white block">
        {value}
      </span>
      <p className="text-slate-400 text-[10px] md:text-xs mt-1 uppercase tracking-wider font-semibold">
        {title}
      </p>
    </div>
  );
};

export default KpiCard;
