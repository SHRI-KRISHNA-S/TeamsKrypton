import React from 'react';
import { Card, CardBody, Badge } from '../../common';

export const VolunteerEvents: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Assigned Events</h1>
        <p className="text-xs text-slate-400 mt-1">Operations schedules for events where you are registered as staff.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody className="space-y-4">
            <Badge variant="primary">Coding Club</Badge>
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">HackTech 2026</h3>
            <p className="text-xs text-slate-500 leading-normal">Volunteering role: Welcoming desks registration scan verification.</p>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span>Date: Aug 15, 2026</span>
              <span>Duty: 09:00 AM - 12:00 PM</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
