import React from 'react';
import { Card, CardBody } from '../../common';

export const FacultyMembershipApprovals: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Membership Approvals</h1>
        <p className="text-xs text-slate-400 mt-1">Review membership applications submitted for clubs under your supervision.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-12 text-center text-xs text-slate-400">
          All applications currently aligned. Refer to the dashboard panel for instant approvals.
        </CardBody>
      </Card>
    </div>
  );
};
