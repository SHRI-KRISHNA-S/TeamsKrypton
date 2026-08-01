import React from 'react';
import { Card, CardBody, Button } from '../../common';

export const FacultyReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Coordinated Activity Summaries</h1>
        <p className="text-xs text-slate-400 mt-1">Generate reports for Dean reviews.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Faculty Overseer Roster Summary</h4>
          <p className="text-xs text-slate-500 leading-normal">Download verified list of student metrics.</p>
          <Button variant="primary" size="sm" onClick={() => alert('Summary exported.')} className="bg-emerald-600 hover:bg-emerald-700">Export Summary</Button>
        </CardBody>
      </Card>
    </div>
  );
};
