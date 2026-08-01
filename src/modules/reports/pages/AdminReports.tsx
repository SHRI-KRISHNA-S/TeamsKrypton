import React from 'react';
import { Card, CardBody, Button } from '../../common';

export const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">College-Wide Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Review aggregated parameters for all student clubs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">Campus Club Report (August 2026)</h4>
          <p className="text-xs text-slate-500 leading-normal">Includes registration counts and active credentials ledgers.</p>
          <Button variant="primary" size="sm" onClick={() => alert('Admin report exported.')} className="bg-blue-600 hover:bg-blue-750">Download Report</Button>
        </CardBody>
      </Card>
    </div>
  );
};
