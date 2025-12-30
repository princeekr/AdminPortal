
import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group cursor-default">
      <div className={`p-4 rounded-xl ${colorClass} text-white transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</span>
        {loading ? (
          <div className="h-8 w-20 bg-slate-100 animate-pulse rounded mt-1"></div>
        ) : (
          <span className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
