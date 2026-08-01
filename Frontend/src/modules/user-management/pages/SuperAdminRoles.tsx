import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const SuperAdminRoles: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Roles Configuration</h1>
        <p className="text-xs text-slate-400 mt-1 font-sans">Modify security groups and hierarchy boundaries.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Role Label', accessor: 'label' },
              { header: 'Inherits From', accessor: 'inherits' },
              { header: 'Clearance Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { label: 'Super Admin', inherits: 'College Admin', status: 'Enabled' },
              { label: 'College Admin', inherits: 'Faculty Coordinator', status: 'Enabled' },
              { label: 'Faculty Coordinator', inherits: 'Club President', status: 'Enabled' },
              { label: 'Club President', inherits: 'Student', status: 'Enabled' },
              { label: 'Student', inherits: 'Guest', status: 'Enabled' }
            ]}
            keyExtractor={(row) => row.label}
          />
        </CardBody>
      </Card>
    </div>
  );
};
