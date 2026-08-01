import React from 'react';
import { Card, CardBody } from '../../common';

export const FacultyClubs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Assigned Clubs</h1>
        <p className="text-xs text-slate-400 mt-1">Review activity parameters of clubs under your academic supervision.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={true}>
          <CardBody className="space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Coding Club</h3>
            <p className="text-xs text-slate-500 leading-normal">Coordinator duty active. Review logs, approve proposals, and monitor student counts.</p>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span>142 Members</span>
              <span className="text-emerald-500 font-semibold">Active Roster</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
