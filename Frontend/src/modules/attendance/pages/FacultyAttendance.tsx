import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const FacultyAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Attendance Logs Review</h1>
        <p className="text-xs text-slate-400 mt-1">Approve verified rosters or audit event check-in compliance logs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'title' },
              { header: 'Verified Attendees', accessor: 'attendees' },
              { header: 'Audit Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { title: 'HackTech 2026', attendees: '142 students', status: 'Audit Passed' },
              { title: 'Figma Design Workshop', attendees: '64 students', status: 'Audit Passed' }
            ]}
            keyExtractor={(row) => row.title}
          />
        </CardBody>
      </Card>
    </div>
  );
};
