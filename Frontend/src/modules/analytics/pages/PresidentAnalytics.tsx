import React from 'react';
import { Card, CardHeader, CardBody } from '../../common';

export const PresidentAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Examine active participation and student conversions lists.</p>
      </div>
      <Card hoverable={false}>
        <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Interaction Trends</h3></CardHeader>
        <CardBody className="h-44 w-full flex items-end">
          <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#purple-grad)" fillOpacity="0.15" />
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#8B5CF6" strokeWidth="3" />
            <defs>
              <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </CardBody>
      </Card>
    </div>
  );
};
