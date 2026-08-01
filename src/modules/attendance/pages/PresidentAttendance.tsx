import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const PresidentAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Attendance Log</h1>
        <p className="text-xs text-slate-400 mt-1">Review check-in conversion sheets for events organized by your club.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Student Profile', accessor: 'name' },
              { header: 'Registered Event', accessor: 'event' },
              { header: 'Check-in Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Amit Sharma', event: 'HackTech 2026 Keynote', status: 'Checked In' },
              { name: 'Jane Doe', event: 'HackTech 2026 Keynote', status: 'Checked In' },
              { name: 'Mark Smith', event: 'Figma Design Workshop', status: 'Checked In' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
