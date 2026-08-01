import React from 'react';
import { Card, CardBody, Button, Table } from '../../common';

export const EventManagerRegistrations: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Registrations Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Review sign-up sheets and limit event capacity values.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'title' },
              { header: 'Max Allocations', accessor: 'cap' },
              { header: 'Signups Count', accessor: 'signed' },
              { header: 'Actions', accessor: () => <Button variant="outline" size="sm">Modify Cap</Button> }
            ]}
            data={[
              { title: 'HackTech 2026', cap: 300, signed: '250 signed up' },
              { title: 'RoboWars Championship', cap: 200, signed: '180 signed up' }
            ]}
            keyExtractor={(row) => row.title}
          />
        </CardBody>
      </Card>
    </div>
  );
};
