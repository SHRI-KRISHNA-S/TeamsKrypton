import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../common';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';

interface GrowthChartsProps {
  monthlyData: { month: string; members: number; events: number; apPoints: number }[];
}

export const GrowthCharts: React.FC<GrowthChartsProps> = ({ monthlyData }) => {
  const [metricMode, setMetricMode] = useState<'members' | 'events' | 'apPoints'>('members');

  const maxVal = Math.max(...monthlyData.map(d => d[metricMode]), 1);

  return (
    <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Growth & Analytics Trends</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Track semester performance over recent months.</p>
          </div>
        </div>

        {/* Metric mode toggle buttons */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setMetricMode('members')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              metricMode === 'members' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Members
          </button>

          <button
            onClick={() => setMetricMode('events')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              metricMode === 'events' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Events
          </button>

          <button
            onClick={() => setMetricMode('apPoints')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              metricMode === 'apPoints' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Award className="h-3.5 w-3.5" /> AP Points
          </button>
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-6">
        {/* Visual Bar Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-3 sm:gap-6 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
          {monthlyData.map((item, idx) => {
            const val = item[metricMode];
            const heightPercent = Math.min(100, Math.max(15, Math.round((val / maxVal) * 100)));
            const barColor = metricMode === 'members' ? 'bg-indigo-500' : metricMode === 'events' ? 'bg-purple-500' : 'bg-amber-500';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-80 group-hover:opacity-100">
                  {val}
                </div>
                <div 
                  className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${barColor} group-hover:brightness-110 shadow-sm`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-bold text-slate-400 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
