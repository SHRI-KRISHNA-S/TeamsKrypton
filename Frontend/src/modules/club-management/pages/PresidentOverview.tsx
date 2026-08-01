import React from 'react';
import { Card, CardHeader, CardBody } from '../../common';

export const PresidentOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Detailed operational state of your assigned student body.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false}>
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coding Club Summary</h3></CardHeader>
          <CardBody className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Academic advisor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">Dr. Sarah Jenkins</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Total Registered Members:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">142 Students</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Active Events Count:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">1 Proposed, 1 Approved</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
