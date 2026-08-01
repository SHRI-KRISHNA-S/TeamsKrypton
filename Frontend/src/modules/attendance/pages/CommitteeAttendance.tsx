import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const CommitteeAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Attendance Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Inspect logged attendees counts for this week's events.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'event' },
              { header: 'Roster Checked-in', accessor: 'checked' },
              { header: 'Absentees Count', accessor: 'absent' },
              { header: 'Verification Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { event: 'HackTech 2026 Keynote', checked: '142 students', absent: '18 students', status: 'Roster Finalized' },
              { event: 'Figma Design Workshop', checked: '64 students', absent: '4 students', status: 'Roster Finalized' }
            ]}
            keyExtractor={(row) => row.event}
          />
        </CardBody>
      </Card>
    </div>
  );
};
