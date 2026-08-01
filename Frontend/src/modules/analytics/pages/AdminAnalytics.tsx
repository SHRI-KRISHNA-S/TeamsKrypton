import React from 'react';
import { Card, CardBody } from '../../common';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">College Analytics</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Review metrics across all department parameters.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="h-44 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#blue-grad)" fillOpacity="0.15" />
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#2563EB" strokeWidth="3" />
            <defs>
              <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </CardBody>
      </Card>
    </div>
  );
};
