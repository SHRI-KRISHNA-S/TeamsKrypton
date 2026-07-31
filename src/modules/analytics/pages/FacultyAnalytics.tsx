import React from 'react';
import { Card, CardBody, ProgressBar } from '../../common';

export const FacultyAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Faculty Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review club performance indexes.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Coding Club Performance</span>
              <span>92% Efficiency</span>
            </div>
            <ProgressBar value={92} max={100} color="secondary" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
