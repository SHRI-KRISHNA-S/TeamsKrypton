import React, { useState } from 'react';
import { Card, CardBody, Badge, Button, Table } from '../../common';

export const CommitteeRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState([
    { id: '1', name: 'Jane Doe', dept: 'CS', event: 'HackTech 2026', verified: false },
    { id: '2', name: 'Mark Smith', dept: 'EE', event: 'HackTech 2026', verified: true },
    { id: '3', name: 'Alice Johnson', dept: 'BBA', event: 'National Debate', verified: false }
  ]);

  const verifyReg = (id: string) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, verified: true } : r));
    alert('Simulated Verification: Student registration credentials approved.');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Active Registrations</h1>
        <p className="text-xs text-slate-400 mt-1">Verify event registration tickets before granting check-in entrance.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Student Name', accessor: 'name' },
              { header: 'Event Requested', accessor: 'event' },
              { header: 'Verification Status', accessor: (row) => <Badge variant={row.verified ? 'secondary' : 'accent'}>{row.verified ? 'Verified' : 'Pending Verification'}</Badge> },
              { 
                header: 'Control', 
                accessor: (row) => !row.verified && (
                  <Button variant="secondary" size="sm" onClick={() => verifyReg(row.id)}>
                    Verify ticket
                  </Button>
                )
              }
            ]}
            data={registrations}
            keyExtractor={(row) => row.id}
          />
        </CardBody>
      </Card>
    </div>
  );
};
