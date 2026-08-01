import React from 'react';
import { Card, CardBody, Button } from '../../common';

export const PresidentReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Activity Reports</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Export performance statistics for Dean operations.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Annual Activity summary (2025-26)</h4>
          <p className="text-xs text-slate-500 leading-normal">Includes budgets breakdown, total attendance figures, and verification lists.</p>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => alert('PDF export generated.')} className="bg-purple-600 hover:bg-purple-700">Download PDF Report</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
