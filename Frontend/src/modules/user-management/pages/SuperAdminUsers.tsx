import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const SuperAdminUsers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Super User Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Platform-wide registry of active accounts.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Profile Name', accessor: 'name' },
              { header: 'Upstream Role', accessor: 'role' },
              { header: 'Clearance level', accessor: (row) => <Badge variant="danger">{row.level}</Badge> }
            ]}
            data={[
              { name: 'System Root Admin', role: 'Super Admin', level: 'Level 10' },
              { name: 'Dean of Student Affairs', role: 'College Admin', level: 'Level 8' },
              { name: 'Dr. Sarah Jenkins', role: 'Faculty Coordinator', level: 'Level 6' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
