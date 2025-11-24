'use client'
import React, { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color
}: StatCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
          <ArrowUpRight className="w-4 h-4" />
          {change}
        </div>
      </div>
      <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
