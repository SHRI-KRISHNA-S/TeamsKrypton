import React from 'react';
import { Card, CardBody } from '../../common';

export const PresidentRequests: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Membership Applications</h1>
        <p className="text-xs text-slate-400 mt-1">Review registration applications submitted by campus students.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-10 text-center text-xs text-slate-400">
          Please refer to the Memberships approvals checklist on your Dashboard page.
        </CardBody>
      </Card>
    </div>
  );
};
