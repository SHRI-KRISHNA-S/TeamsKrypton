import React from 'react';
import { Card, CardBody } from '../../common';

export const FacultyApprovals: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Pending Event Proposals</h1>
        <p className="text-xs text-slate-400 mt-1">Sign off budget requests or schedule approvals submitted by Club Presidents.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-10 text-center text-xs text-slate-400">
          Please review the Approvals list on your Dashboard page.
        </CardBody>
      </Card>
    </div>
  );
};
