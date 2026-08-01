import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const SuperAdminPermissions: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Permission Matrix</h1>
        <p className="text-xs text-slate-400 mt-1">Configure feature access boundaries for each role.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Route Scope', accessor: 'scope' },
              { header: 'Student Access', accessor: (row) => <Badge variant={row.student ? 'secondary' : 'neutral'}>{row.student ? 'Allowed' : 'Blocked'}</Badge> },
              { header: 'Super Admin Access', accessor: () => <Badge variant="danger">Allowed</Badge> }
            ]}
            data={[
              { scope: '/dashboard', student: true },
              { scope: '/superadmin/*', student: false }
            ]}
            keyExtractor={(row) => row.scope}
          />
        </CardBody>
      </Card>
    </div>
  );
};
