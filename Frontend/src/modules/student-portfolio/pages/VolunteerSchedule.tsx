import React from 'react';
import { Card, CardBody, Table } from '../../common';

export const VolunteerSchedule: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Volunteer Roster Schedule</h1>
        <p className="text-xs text-slate-400 mt-1">Shifts and hours allocated by Event Managers.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Allocated Duty', accessor: 'duty' },
              { header: 'Allocated Event', accessor: 'event' },
              { header: 'Shift Interval', accessor: 'shift' },
              { header: 'Lead Supervisor', accessor: 'lead' }
            ]}
            data={[
              { duty: 'Registrations Scanner', event: 'HackTech 2026', shift: '09:00 AM - 12:00 PM', lead: 'Alex Mercer (President)' },
              { duty: 'Swag Handout Desk', event: 'HackTech 2026', shift: '01:00 PM - 04:00 PM', lead: 'Amit Sharma (Lead)' }
            ]}
            keyExtractor={(row) => row.shift}
          />
        </CardBody>
      </Card>
    </div>
  );
};
