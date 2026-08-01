import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">User Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Register, assign, or delete student profiles and faculty coordinates.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Profile Name', accessor: 'name' },
              { header: 'Portal Role', accessor: 'role' },
              { header: 'Clearance Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Amit Sharma', role: 'Student', status: 'Active' },
              { name: 'Dr. Sarah Jenkins', role: 'Faculty Coordinator', status: 'Active' },
              { name: 'Dean of Student Affairs', role: 'College Admin', status: 'Active' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
