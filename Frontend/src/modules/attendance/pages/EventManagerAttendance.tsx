import React from 'react';
import { Card, CardHeader, CardBody, ProgressBar } from '../../common';

export const EventManagerAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Attendance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review check-in conversion ratios and download verified rosters logs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false}>
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Rate Tracker</h3></CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>HackTech 2026 Keynote</span>
                <span>94% Check-in</span>
              </div>
              <ProgressBar value={94} max={100} color="accent" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Figma UI/UX Workshop</span>
                <span>86% Check-in</span>
              </div>
              <ProgressBar value={86} max={100} color="secondary" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
